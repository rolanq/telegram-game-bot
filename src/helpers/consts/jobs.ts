import { jobsURLs } from "./picturesURLs";
import { Jobs, JobT } from "types";

export const courier: JobT = {
  charge: 10,
  name: Jobs.courier,
  image: jobsURLs.courier,
  requiredCharacteristics: {
    intelligence: 1,
    strength: 1,
  },
};

export const chef: JobT = {
  charge: 20,
  name: Jobs.chef,
  image: jobsURLs.chef,
  requiredCharacteristics: {
    intelligence: 5,
    strength: 3,
  },
};

export const office: JobT = {
  charge: 30,
  name: Jobs.office,
  image: jobsURLs.office,
  requiredCharacteristics: {
    intelligence: 10,
    strength: 1,
  },
};

export const allJobs = [courier, chef, office]
