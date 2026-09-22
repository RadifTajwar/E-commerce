/**
 * Minimal in-memory stand-in for the ioredis surface used by cache.ts and
 * rate-limit.ts. Not a full Redis; just enough for deterministic unit tests.
 */
export class FakeRedis {
  store = new Map<string, { value: string; expiresAt?: number }>();
  sets = new Map<string, Set<string>>();
  failing = false;

  private check() {
    if (this.failing) throw new Error("fake redis down");
  }
  private live(key: string) {
    const e = this.store.get(key);
    if (e?.expiresAt && e.expiresAt <= Date.now()) {
      this.store.delete(key);
      return undefined;
    }
    return e;
  }

  async get(key: string) {
    this.check();
    return this.live(key)?.value ?? null;
  }
  async set(key: string, value: string, _ex?: string, ttl?: number) {
    this.check();
    this.store.set(key, { value, expiresAt: ttl ? Date.now() + ttl * 1000 : undefined });
    return "OK";
  }
  async del(...keys: string[]) {
    this.check();
    let n = 0;
    for (const k of keys) {
      if (this.store.delete(k)) n++;
      if (this.sets.delete(k)) n++;
    }
    return n;
  }
  async sadd(key: string, member: string) {
    this.check();
    if (!this.sets.has(key)) this.sets.set(key, new Set());
    this.sets.get(key)!.add(member);
    return 1;
  }
  async smembers(key: string) {
    this.check();
    return [...(this.sets.get(key) ?? [])];
  }
  async expire(key: string, ttl: number) {
    this.check();
    const e = this.store.get(key);
    if (e) e.expiresAt = Date.now() + ttl * 1000;
    return 1;
  }
  async incr(key: string) {
    this.check();
    const e = this.live(key);
    const next = (e ? Number(e.value) : 0) + 1;
    this.store.set(key, { value: String(next), expiresAt: e?.expiresAt });
    return next;
  }
  async ttl(key: string) {
    this.check();
    const e = this.live(key);
    if (!e) return -2;
    if (!e.expiresAt) return -1;
    return Math.max(0, Math.ceil((e.expiresAt - Date.now()) / 1000));
  }
  pipeline = () => {
    const ops: Array<() => Promise<unknown>> = [];
    const p = {
      set: (...a: Parameters<FakeRedis["set"]>) => (ops.push(() => this.set(...a)), p),
      sadd: (...a: Parameters<FakeRedis["sadd"]>) => (ops.push(() => this.sadd(...a)), p),
      expire: (...a: Parameters<FakeRedis["expire"]>) => (ops.push(() => this.expire(...a)), p),
      incr: (...a: Parameters<FakeRedis["incr"]>) => (ops.push(() => this.incr(...a)), p),
      ttl: (...a: Parameters<FakeRedis["ttl"]>) => (ops.push(() => this.ttl(...a)), p),
      del: (...a: Parameters<FakeRedis["del"]>) => (ops.push(() => this.del(...a)), p),
      exec: async () => {
        const out: Array<[Error | null, unknown]> = [];
        for (const op of ops) out.push([null, await op()]);
        return out;
      },
    };
    return p;
  };
}
