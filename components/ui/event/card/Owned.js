import Image from "next/image";
import Link from "next/link";
import { getDateObject, getFormattedDate } from "@utils/dates";

const STATE_COLORS = {
  purchased: "indigo",
  activated: "green",
  deactivated: "red",
};

export default function OwnedEventCard({ children, course }) {
  const stateColor = STATE_COLORS[course.state];

  return (
    <div className="bg-white border shadow overflow-hidden sm:rounded-lg mb-3">
      <div className="block sm:flex">
        <div className="flex-1">
          <div className="h-72 sm:h-full next-image-wrapper">
            <Image
              className="object-cover"
              src={course.coverImage}
              width="45"
              height="45"
              layout="responsive"
              alt={course.title}
            />
          </div>
        </div>
        <div className="flex-4">
          {/*
           */}

          <div className="flex items-center">
            <div className="uppercase mr-2 tracking-wide text-sm text-indigo-500 font-semibold">
              {course.type}
            </div>

            <div>
              {getDateObject(course.beginDate) < Date.now() && (
                <div className="text-xs text-black bg-yellow-200 p-1 px-3 rounded-full">
                  Passed
                </div>
              )}
            </div>
            <div>
              {getDateObject(course.beginDate) >= Date.now() && (
                <div className="text-xs text-black bg-blue-200 p-1 px-3 rounded-full">
                  Upcoming
                </div>
              )}
            </div>
          </div>

          {/* 



           */}
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              <span className="mr-2">{course.title}</span>
              <span
                className={`text-xs text-${stateColor}-700 bg-${stateColor}-200 rounded-full p-2`}
              >
                {course.state}
              </span>
            </h3>
            {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {course.price} ETH
            </p> */}
          </div>

          <div className="border-t border-gray-200">
            <p className="mt-2 mb-4 text-sm sm:text-base text-gray-500">
              {getFormattedDate(course.beginDate)}
            </p>
            <dl>
              <div className="bg-gray-50 px-4 py-5  sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Your Link To Join
                </dt>

                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <Link href={`/`}>
                    <a className="block mt-1 text-sm leading-tight font-medium hover:underline">
                      {course.zoomLink}
                    </a>
                  </Link>
                </dd>
              </div>
              {/* <div className="bg-white px-4 py-5 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Proof</dt>
                <dd className="mt-1 text-sm break-words text-gray-900 sm:mt-0 sm:col-span-2">
                  {course.proof}
                </dd>
              </div> */}
              <div className="bg-white px-4 py-5 sm:px-6">{children}</div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
