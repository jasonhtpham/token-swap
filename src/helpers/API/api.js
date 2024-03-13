import { axiosInstance, errorHelper, generateSuccess } from "./axiosInstance";
import { constructSignature } from '../utils/utils';

class API {
  /**
   *
   * @param {Object} data
   * @returns {Promise<Object>}
   */
  async createJob(data) {
    const signature = constructSignature();

    return axiosInstance
      .post(`job/createJob`, data, {
        headers: {
          'X-API-KEY': `${process.env.REACT_APP_SCHARE_API_KEY}`,
          'X-SIGNATURE': `${signature}`,
        }
      })
      .then((response) => generateSuccess(response.data.data))
      .catch((error) => errorHelper(error));
  }
}
const instance = new API();
export default instance;
