# CommerceTools and Super Payment Extension

The application provides a basic e-commerce site integrated with CommerceTools and Super Payment. This is pulling a product catalog directly from Commercetools and taking advantage of Commercetools’s cart API when a user adds a new item to a cart.

When a user chooses to checkout the e-commerce site will create both a Super Payment intent and Commercetools Order using the details from the cart, the PaymentIntent will include the Commercetools CartID and OrderID as metadata. The user can now be presented with either Super Payment Elements or Super Payment Checkout to complete the transaction. A Super Payment Webhook will send succeeded or payment_failed to the e-commerce site. The e-commerce site will then process the event and update the Commercetools order status accordingly, getting the order_id from the PaymentIntent’s metadata.

## Features

- Express
- REST API

## Requirements

- [node & npm](https://nodejs.org/en/)
- [git](https://github.com/superpayments/commercetools-plugin-api-extension)

## Installation

- `git clone https://github.com/sumitdotsquares/commercetools-plugin-api-extension.git`
- `cd commercetools-plugin-api-extension`
- `npm install`
- `npm start`

## Update .env with

When running locally copy `/.env-sample` to `/.env` update with your details

```bash
cp .env-sample .env
```

| Variable               | Description                    | Example                                         |
| ---------------------- | ------------------------------ | ----------------------------------------------- |
| SUPAR_API_URL          | Super Payment API URL          | https://api.staging.superpayments.com/v2        |
| SUPAR_API_KEY          | Super Payment API Key          | <your api key>                                  |
| SUPAR_API_CONFIRMATION | Super Payment confirmation Key | <your conformation key>                         |
| CT_PORT                | Port to run the server         | 8081                                            |
| CT_BASE_URL            | Base URL of the server         | http://localhost:8081                           |
| CT_PROJECT_KEY         | CommerceTools Project Key      | <your project key>                              |
| CT_CLIENT_ID           | CommerceTools Client ID        | <your client id>                                |
| CT_SECRET              | CommerceTools Secret Key       | <your secret id>                                |
| CT_API_URL             | CommerceTools API URL          | https://api.europe-west1.gcp.commercetools.com  |
| CT_AUTH_URL            | CommerceTools Auth URL         | https://auth.europe-west1.gcp.commercetools.com |
| SUPER_successUrl       | Success return url             | https://www.merchant.com/success.html           |
| SUPER_cancelUrl        | Cancel return url              | https://www.merchant.com/cancel.html            |
| SUPER_failureUrl       | Fail return url                | https://www.merchant.com/fail.html              |

## Deploy on production with [PM2](https://www.npmjs.com/package/pm2)

### Installing PM2

With NPM

```bash
pm2 start app.js
```

You can install Node.js easily with NVM or ASDF.

###Start an application
You can start any application (Node.js, Python, Ruby, binaries in $PATH...) like that:

```bash
pm2 start app.js
```

# Commerce Tools

Create account on commercetool with following steps.

- Go to commerctools official website and create [merchant account](https://commercetools.com/free-trial) from there as free trial account if you want to continue then you can.
- After create you account you need to create [client API](https://mc.europe-west1.gcp.commercetools.com/super-payment/settings/developer/api-clients/new)

When creating a new API client you will need to set the following Scopes:

### Manage

- Customers
- Orders
- Payments
- Products

### View

- Categories
- Customers
- Orders
- Payments
- Products (all)
- Products (published)

### Manage My

- Orders
- Payments
- Profile
- Shopping Lists

# Webhooks

This example used webhooks to handel payment's asynchronously, an Super Payment webhook will be configured when starting the sever which will use the `CT_BASE_URL` configured in the .env file.

## Webhooks Details [OPTIONAL]

Super Payment register your webhook endpoint, provide the publicly accessible HTTPS URL to your webhook endpoint, and select the type of events you’re receiving in your endpoint. The URL format to register a webhook endpoint is:

https://<your-website>/super-payment/success
https://<your-website>/super-payment/refund


For example, if your domain is `https://mycompanysite.com` specify `https://mycompanysite.com/super-payment/success` as the endpoint URL.

## Extension Endpoints

| URL                           | Method | Description                                                         |
| ----------------------------- | ------ | ------------------------------------------------------------------- |
| /products                     | GET    | Get product from commercetool panel                                 |
| /customer/:email?             | GET    | Check customer exist by email                                       |
| /cart/:cartId?                | GET    | Get cart info by cart Id                                            |
| /cart                         | POST   | Create cart on commercetools                                        |
| /cart/line-item               | POST   | Add Item in cart                                                    |
| /cart/customer                | POST   | Add customer with cart                                              |
| /customer                     | POST   | Create customer on commercetools                                    |
| /super-payment/get-offer      | POST   | Get offer detail from Super Paymet                                  |
| /super-payment/get-offer-link | POST   | Get payment link from Super Paymet                                  |
| /super-payment/refunds        | POST   | Initiat Refund amount on Super Payment                              |
| /order                        | POST   | Create order by cart id                                             |
| /create-super-payment         | POST   | Create Payment intent for order                                     |
| /add-payment-to-order         | POST   | Add payment to order detail                                         |
| /update-order-status          | POST   | Update order status ofter fail and success payment in commercetools |

#### CURL

- GET Products:
  - `curl -X GET -H "Content-Type:application/json" http://localhost:8081/products`

#### Postman

- Install [Postman](https://www.getpostman.com/apps) to interact with REST API
- Get products
  - Open POSTMAN
  - Click on "import" tab on the upper left side.
  - Select the Raw Text option and paste above cURL command.
  - Hit import and you will have the command in your Postman builder!
  - Click Send to post the command
