import axios from "axios";

async function getOffer(data) {
  const SP_BASE_URL = process.env.SUPER_API_URL;
  const SP_API_KEY = process.env.SUPER_API_KEY;

  var config = {
    method: "post",
    url: SP_BASE_URL + "/offers",
    headers: {
      "Content-Type": "application/json",
      "checkout-api-key": SP_API_KEY,
    },
    data: data,
  };

  const rsp = await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return await rsp;
}

async function getPaymentLink(data) {
  const SP_BASE_URL = process.env.SUPER_API_URL;
  const SP_API_KEY = process.env.SUPER_API_KEY;

  var config = {
    method: "post",
    url: SP_BASE_URL + "/payments",
    headers: {
      "Content-Type": "application/json",
      "checkout-api-key": SP_API_KEY,
    },
    data: data,
  };

  const rsp = await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });

  return await rsp;
}

async function refundPayment(data) {
  const SP_BASE_URL = process.env.SUPER_API_URL;
  const SP_API_KEY = process.env.SUPER_API_KEY;

  var config = {
    method: "POST",
    url: SP_BASE_URL + "/refunds",
    headers: {
      "Content-Type": "application/json",
      "checkout-api-key": SP_API_KEY,
    },
    data: data,
  };

  const rsp = await axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
    });
    console.log('Sumit', rsp);
  return await rsp;
}

export default { getOffer, getPaymentLink, refundPayment };