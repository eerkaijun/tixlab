import { useAccount, useOwnedCourses } from "@components/hooks/web3";
import { Button, Message } from "@components/ui/common";
import { OwnedEventCard } from "@components/ui/event";
import { BaseLayout } from "@components/ui/layout";
import { MarketHeader } from "@components/ui/marketplace";
import { getAllCourses } from "@content/events/fetcher";
import { useRouter } from "next/router";
import Link from "next/link";
import { useWeb3 } from "@components/providers";

export default function OwnedCourses({ courses }) {
  const router = useRouter();
  const { requireInstall } = useWeb3();
  const { account } = useAccount();
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  return (
    <>
      <MarketHeader />
      <section className="grid grid-cols-1">
        {ownedCourses.isEmpty && (
          <div className="w-1/2">
            <Message type="warning">
              <div>You don&apos;t own any tickets</div>
              <Link href="/marketplace">
                <a className="font-normal hover:underline">
                  <i>Purchase Ticket</i>
                </a>
              </Link>
            </Message>
          </div>
        )}
        {account.isEmpty && (
          <div className="w-1/2">
            <Message type="warning">
              <div>Please connect to Metamask</div>
            </Message>
          </div>
        )}
        {requireInstall && (
          <div className="w-1/2">
            <Message type="warning">
              <div>Please install Metamask</div>
            </Message>
          </div>
        )}
        {ownedCourses.data?.map((course) => (
          <OwnedEventCard key={course.id} course={course}>
            {/* <Button onClick={() => router.push(`/courses/${course.slug}`)}>
              Watch the course
            </Button> */}
          </OwnedEventCard>
        ))}
      </section>
    </>
  );
}

export function getStaticProps() {
  const { data } = getAllCourses();
  return {
    props: {
      courses: data,
    },
  };
}

OwnedCourses.Layout = BaseLayout;
