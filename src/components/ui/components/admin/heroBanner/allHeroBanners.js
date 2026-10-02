"use client";
import RowActions from "@/components/admin/RowActions";
import TableSkeletonRows from "@/components/admin/TableSkeletonRows";
import Thumb from "@/components/admin/Thumb";
import {
  Card,
  CardBody,
  EmptyState,
  Table,
  TableWrap,
  TBody,
  TD,
  TH,
  THead,
  TR,
} from "@/components/admin/ui";
import { isPending } from "@/store/create-request-slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchAllHeroBanners } from "@/store/slices/banner.slice";
import { useEffect } from "react";

export default function AllHeroBanners({ toggleVisibility }) {
  const dispatch = useAppDispatch();
  const heroState = useAppSelector((state) => state.allHeroBanner);
  const { heroBanners, error } = heroState;
  const busy = isPending(heroState);

  useEffect(() => {
    void dispatch(fetchAllHeroBanners());
  }, [dispatch]);

  return (
    <>
      {error && !busy && (
        <Card className="mb-5 shrink-0 border-red-200 dark:border-red-900/50">
          <CardBody className="text-sm text-red-600 dark:text-red-400">{error}</CardBody>
        </Card>
      )}

      <TableWrap>
        <Table>
          <THead>
            <TR>
              <TH>Images</TH>
              <TH>Header</TH>
              <TH align="right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {busy && <TableSkeletonRows columns={3} />}
            {!busy &&
              heroBanners?.map((banner) => (
                <TR key={banner._id}>
                  <TD>
                    <div className="flex items-center gap-2">
                      {(banner.image ?? []).slice(0, 4).map((src, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <Thumb key={i} src={src} alt={`${banner.header ?? "Banner"} image ${i + 1}`} />
                      ))}
                      {(banner.image?.length ?? 0) > 4 && (
                        <span className="text-xs text-slate-400">
                          +{(banner.image?.length ?? 0) - 4}
                        </span>
                      )}
                    </div>
                  </TD>
                  <TD className="font-medium text-slate-900 dark:text-white">
                    {banner.header || <span className="text-slate-400">No header</span>}
                  </TD>
                  <TD align="right">
                    <RowActions
                      label={banner.header ?? "banner"}
                      onEdit={() => toggleVisibility(banner._id)}
                    />
                  </TD>
                </TR>
              ))}
          </TBody>
        </Table>

        {!busy && (!heroBanners || heroBanners.length === 0) && (
          <EmptyState
            title="No hero banner set"
            description="The hero banner is the carousel at the top of the storefront."
          />
        )}
      </TableWrap>
    </>
  );
}
