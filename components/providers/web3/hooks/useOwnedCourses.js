import { createCourseHash } from "@utils/hash";
import { normalizeOwnedCourse } from "@utils/normalize";
import useSWR from "swr";

export const handler = (web3, contract) => (courses, account) => {
  const swrRes = useSWR(
    () => (web3 && contract && account ? `web3/ownedCourses/${account}` : null),
    async () => {
      console.log("!!!ownedCourses begins....");
      const ownedCourses = [];
      for (let i = 0; i < courses.length; i++) {
        const course = courses[i];
        const attendeesLength = await contract.methods
          .getAttendeesLength(i)
          .call();
        for (let y = 0; y < attendeesLength; y++) {
          const attendee = await contract.methods.attendees(i, y).call();
          if (attendee == account) {
            ownedCourses.push(course);
            break;
          }
        }
        if (!course.id) {
          continue;
        }
      }
      console.log("!!!ownedCourses ends....");
      return ownedCourses;
    }
  );

  return {
    ...swrRes,
    lookup:
      swrRes.data?.reduce((a, c) => {
        a[c.id] = c;
        return a;
      }, {}) ?? {},
  };
};
