import { EventCard, EventList } from "@components/ui/event";
import { BaseLayout } from "@components/ui/layout";
import { getAllCourses } from "@content/events/fetcher";
import { useOwnedCourses, useWalletInfo } from "@components/hooks/web3";
import { Button, Loader, Message } from "@components/ui/common";
import { OrderModal } from "@components/ui/order";
import { useState } from "react";
import { MarketHeader } from "@components/ui/marketplace";
import { useWeb3 } from "@components/providers";
import { withToast } from "@utils/toast";

import { create } from "ipfs-http-client";

const ipfs = create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

export default function Marketplace({ courses }) {
  const { web3, contract, requireInstall } = useWeb3();
  const { hasConnectedWallet, isConnecting, account } = useWalletInfo();
  const { ownedCourses } = useOwnedCourses(courses, account.data);

  const [selectedCourse, setSelectedCourse] = useState(null);
  const [busyCourseId, setBusyCourseId] = useState(null);
  const [isNewPurchase, setIsNewPurchase] = useState(true);

  const purchaseCourse = async (order, course) => {
    const value = web3.utils.toWei(String(order.price));

    setBusyCourseId(course.id);
    withToast(_purchaseCourse({ value }, course));
  };

  const _purchaseCourse = async ({ hexCourseId, proof, value }, course) => {
    try {
      // try {
      //   const ticketURI = await createTicket();
      // } catch (error) {
      //   throw new Error(error.message);
      // }
      const ticketURI = await createTicket();

      const result = await contract.methods
        .buyTicket(course.id, ticketURI)
        // .buyTicket(course.id)
        .send({ from: account.data, value: value });

      ownedCourses.mutate([
        ...ownedCourses.data,
        {
          ...course,
          state: "purchased",
          owner: account.data,
          price: value,
        },
      ]);

      return result;
    } catch (error) {
      throw new Error(error.message);
    } finally {
      setBusyCourseId(null);
    }
  };

  //
  //
  //
  //

  const createTicket = async () => {
    let price = "777";
    let zoomLink = "your event zoom link";
    let category = "0";

    let ticketText = `<tspan x="50%" dy="1.2em">Event kink: ${zoomLink}</tspan>

    <tspan x="50%" dy="1.2em">Price: ${price} </tspan>`;

    let encodedString = Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">
  <style>.base { fill: white; font-family: serif; font-size: 14px; }</style>
  <rect width="100%" height="100%" fill="yellow" />
  <text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">${ticketText}</text>
</svg>`
    ).toString("base64");
    let metadata = {
      zoom_link: zoomLink,
      ticket_category: category,
      ticket_value: price,
      attributes: [],
      description: `Tixlab Marketplace. Ticket description`,
      image:
        // "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaW5ZTWluIG1lZXQiIHZpZXdCb3g9IjAgMCAzNTAgMzUwIj4KICAgIDxzdHlsZT4uYmFzZSB7IGZpbGw6IHdoaXRlOyBmb250LWZhbWlseTogc2VyaWY7IGZvbnQtc2l6ZTogMTRweDsgfTwvc3R5bGU+CiAgICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJibGFjayIgLz4KICAgIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBjbGFzcz0iYmFzZSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+RXBpY0xvcmRIYW1idXJnZXI8L3RleHQ+Cjwvc3ZnPg==",
        `data:image/svg+xml;base64,${encodedString}`,
      // "https://ipfs.moralis.io:2053/ipfs/QmdZhzwnFjh71EFxyoWbRZ34G85T3ddE228NbKo5dRgD7J/images/0.png",
      name: `Here Generated # of the ticket`,
    };

    let result = await ipfs.add(JSON.stringify(metadata));

    // await marketplace.methods
    //   .createTicket(
    //     web3.utils.toWei(price, "ether"),
    //     web3.utils.toWei(maxPrice.toString(), "ether"),
    //     result.path
    //   )
    //   .send({ from: account });

    console.log("!!!!Ticket created successfully!");
    console.log("!!!!IPFS hash: ", result.path);
    let res = `https://ipfs.infura.io/ipfs/${result.path}`;
    console.log("!!!!ticket full URI: ", res);

    return res;

    // https://ipfs.infura.io/ipfs/QmVRurswfJ9fqTbfeAgVuHgdjQMH9TQGkN1P43wyyrS2S6
  };

  //
  //
  //
  //

  const cleanupModal = () => {
    setSelectedCourse(null);
    setIsNewPurchase(true);
  };

  return (
    <>
      <MarketHeader />

      <EventList courses={courses}>
        {(course) => {
          const owned = ownedCourses.lookup[course.id];
          return (
            <EventCard
              key={course.id}
              course={course}
              state={owned?.state}
              disabled={!hasConnectedWallet}
              Footer={() => {
                // return (
                //   <Button
                //     variant="white"
                //     size="sm"
                //     onClick={() => {
                //       createTicket();
                //     }}
                //   >
                //     Create Ticket
                //   </Button>
                // );

                if (requireInstall) {
                  return (
                    <Button size="sm" disabled={true} variant="lightPurple">
                      Install
                    </Button>
                  );
                }

                if (isConnecting) {
                  return (
                    <Button size="sm" disabled={true} variant="lightPurple">
                      <Loader size="sm" />
                    </Button>
                  );
                }

                if (!ownedCourses.hasInitialResponse) {
                  return (
                    // <div style={{height: "42px"}}></div>
                    <Button variant="white" disabled={true} size="sm">
                      {hasConnectedWallet ? "Loading State..." : "Connect"}
                    </Button>
                  );
                }

                const isBusy = busyCourseId === course.id;
                if (owned) {
                  return (
                    <>
                      <div className="flex">
                        <Button
                          onClick={() => alert("You are owner of this course.")}
                          disabled={false}
                          size="sm"
                          variant="white"
                        >
                          Yours &#10004;
                        </Button>
                        {owned.state === "deactivated" && (
                          <div className="ml-1">
                            <Button
                              size="sm"
                              disabled={isBusy}
                              onClick={() => {
                                setIsNewPurchase(false);
                                setSelectedCourse(course);
                              }}
                              variant="purple"
                            >
                              {isBusy ? (
                                <div className="flex">
                                  <Loader size="sm" />
                                  <div className="ml-2">In Progress</div>
                                </div>
                              ) : (
                                <div>Fund to Activate</div>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </>
                  );
                }

                return (
                  <Button
                    onClick={() => setSelectedCourse(course)}
                    size="sm"
                    disabled={!hasConnectedWallet || isBusy}
                    variant="lightPurple"
                  >
                    {isBusy ? (
                      <div className="flex">
                        <Loader size="sm" />
                        <div className="ml-2">In Progress</div>
                      </div>
                    ) : (
                      <div>Purchase</div>
                    )}
                  </Button>
                );
              }}
            />
          );
        }}
      </EventList>
      {selectedCourse && (
        <OrderModal
          course={selectedCourse}
          isNewPurchase={isNewPurchase}
          onSubmit={(formData, course) => {
            purchaseCourse(formData, course);
            cleanupModal();
          }}
          onClose={cleanupModal}
        />
      )}
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

Marketplace.Layout = BaseLayout;
