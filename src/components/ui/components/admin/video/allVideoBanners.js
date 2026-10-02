"use client";
import RowActions from "@/components/admin/RowActions";
import TableSkeletonRows from "@/components/admin/TableSkeletonRows";
import {
  Card,
  CardBody,
  EmptyState,
  Mono,
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
import { fetchAllVideoBanners } from "@/store/slices/banner.slice";
import { useEffect } from "react";

export default function AllVideoBanners({ toggleVisibility }) {
  const dispatch = useAppDispatch();
  const videoState = useAppSelector((state) => state.allVideoBanners);
  const { videoBanners, error } = videoState;
  const busy = isPending(videoState);

  useEffect(() => {
    void dispatch(fetchAllVideoBanners());
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
              <TH>Video</TH>
              <TH>ID</TH>
              <TH align="right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {busy && <TableSkeletonRows columns={3} />}
            {!busy &&
              videoBanners?.map((videoBanner) => (
                <TR key={videoBanner._id}>
                  <TD>
                    {videoBanner.video ? (
                      <video
                        src={videoBanner.video}
                        muted
                        playsInline
                        preload="metadata"
                        className="h-14 w-24 rounded-lg border border-slate-200 object-cover dark:border-slate-700"
                      />
                    ) : (
                      <div className="flex h-14 w-24 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400 dark:bg-slate-800">
                        No video
                      </div>
                    )}
                  </TD>
                  <TD>
                    <Mono>{videoBanner._id}</Mono>
                  </TD>
                  <TD align="right">
                    <RowActions label="video banner" onEdit={() => toggleVisibility(videoBanner._id)} />
                  </TD>
                </TR>
              ))}
          </TBody>
        </Table>

        {!busy && (!videoBanners || videoBanners.length === 0) && (
          <EmptyState
            title="No video banner set"
            description="The video banner plays in the storefront's feature section."
          />
        )}
      </TableWrap>
    </>
  );
}
