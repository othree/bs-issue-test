import { ClientFunction, RequestMock } from 'testcafe';
import { API_ENDPOINT, PRIVATE_KEY, WEB_URL } from './constants';
import axios from 'axios';

export const getLocation = ClientFunction(() =>
  document.location.href.toString()
);

export const getUA = ClientFunction(() => navigator.userAgent);

export const getReferrer = ClientFunction(() => document.referrer);

export const randomIntFromInterval = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

export const randomPhoneNumber = () => {
  const areaCode = randomIntFromInterval(8, 9);

  return `0${areaCode}0${[...new Array(8)]
    .map(() => randomIntFromInterval(0, 9))
    .join('')}`;
};

export const createCheckoutSession = () => {
  const url = `${API_ENDPOINT}/v1/checkout-sessions`;
  const data = {
    successUrl:
      'https://dev-kit.smartpay.co/en/example-pages/checkout-successful/',
    cancelUrl:
      'https://dev-kit.smartpay.co/en/example-pages/checkout-canceled/',
    orderData: {
      amount: 301,
      currency: 'jpy',
      lineItemData: [
        {
          priceData: {
            productData: {
              name: 'ハイドレーティング クリーム',
              description:
                'あなたの肌に、保湿体力を。わきあがるようなつやとうるおいが際立つ肌へ導くモイスチャライザー※、登場。',
              images: [
                'https://brand.shiseido.co.jp/dw/image/v2/BBSC_PRD/on/demandware.static/-/Sites-itemmaster_shiseido_jp/default/dw56f4cab7/products-02/18285/18285_S_01.jpg?sw=1000&sh=1000&sm=fit',
              ],
            },
            amount: 100,
            currency: 'jpy',
          },
          quantity: 1,
        },
        {
          priceData: {
            productData: {
              name: 'ディフェンス ＋ ブライトニング キット',
              description:
                'アルティミューン」「ソフナー」「モイスチャライザー」の3品を体感できる生命感あふれるつややかな肌へ導くD＆Rトライアルキット。',
              images: [
                'https://brand.shiseido.co.jp/dw/image/v2/BBSC_PRD/on/demandware.static/-/Sites-itemmaster_shiseido_jp/default/dw376fd025/products-02/18776/18776_J_01.jpg?sw=1000&sh=1000&sm=fit',
              ],
            },
            amount: 100,
            currency: 'jpy',
          },
          quantity: 1,
        },
        {
          priceData: {
            productData: {
              name: 'トータル Rクリームe',
              description:
                '肌の美を紡ぐ大切な夜に。じっくり優美な肌へ導くクリーム',
              images: [
                'https://brand.shiseido.co.jp/dw/image/v2/BBSC_PRD/on/demandware.static/-/Sites-itemmaster_shiseido_jp/default/dw8d0aeb2b/products/13921/13921_01.jpg?sw=1000&sh=1000&sm=fit',
              ],
            },
            amount: 100,
            currency: 'jpy',
          },
          quantity: 1,
        },
      ],
      shippingInfo: {
        address: {
          line1: 'line1',
          locality: 'locality',
          postalCode: '123',
          country: 'jp',
        },
        feeAmount: 1,
        feeCurrency: 'jpy',
      },
    },
    customerInfo: {
      emailAddress: 'john@smartpay.co',
      firstName: 'John',
      lastName: 'Doe',
      firstNameKana: 'ジョン',
      lastNameKana: 'ドエ',
      phoneNumber: '+818000000000',
      dateOfBirth: '2000-01-01',
      legalGender: 'male',
      address: {
        line1: 'line1',
        line2: 'line2',
        locality: '世田谷区',
        administrativeArea: '東京都',
        postalCode: '155-0031',
        country: 'jp',
      },
      accountAge: 30,
    },
  };

  return axios
    .post(url, data, {
      headers: { Authorization: `Basic ${PRIVATE_KEY}` },
    })
    .then((response) => {
      const sessionIdWithSignature = response.data.url.split('/')[3];
      const orderId = response.data.order.id;

      return {
        orderId,
        sessionIdWithSignature,
        pageURL: `${WEB_URL}/${sessionIdWithSignature}`,
      };
    });
};

const getCheckoutSession = ({ sessionIdWithSignature = '', orderId = '' }) => {
  return {
    id: sessionIdWithSignature.split('.')[0] || '',
    object: 'checkoutSession',
    cancelUrl: 'https://google.com',
    createdAt: 1632453333174,
    customerInfo: {
      emailAddress: 'authorized@smartpay.co',
    },
    metadata: {},
    order: {
      id: orderId || '',
      object: 'order',
      amount: 10000,
      createdAt: 1632708861996,
      currency: 'JPY',
      lineItems: [
        {
          id: 'li_test_2M9ZiA5o8jsHcV8XIduWSL',
          object: 'lineItem',
          metadata: {},
          price: {
            id: 'price_test_AMSZXsPKoa15OIEPoj6AWk',
            object: 'price',
            active: true,
            amount: 10000,
            createdAt: 1632708861996,
            currency: 'JPY',
            metadata: {},
            product: {
              id: 'product_test_JHtTv3oIKg22aTHSUYSa5a',
              object: 'product',
              active: true,
              categories: [],
              createdAt: 1632708861996,
              description: 'a beautiful sweater',
              images: [
                'https://upload.wikimedia.org/Selburose-sweater.jpg/1920px-Selburose-sweater.jpg',
              ],
              metadata: {},
              name: 'sweater',
              test: true,
              updatedAt: 1632708861996,
            },
            test: true,
            updatedAt: 1632708861996,
          },
          quantity: 1,
          test: true,
          updatedAt: 1632708861996,
        },
      ],
      metadata: {},
      shippingInfo: {
        address: {
          line1: 'line1',
          locality: 'locality',
          postalCode: '123',
          country: 'JP',
        },
      },
      status: 'succeeded',
      test: true,
      updatedAt: 1632708861996,
    },
    successUrl: 'https://google.com',
    test: true,
    updatedAt: 1632453333174,
  };
};

export const createTokenCheckoutSession = () => {
  const url = `${API_ENDPOINT}/v1/checkout-sessions`;
  const data = {
    successUrl:
      'https://dev-kit.smartpay.co/en/example-pages/checkout-successful/',
    cancelUrl:
      'https://dev-kit.smartpay.co/en/example-pages/checkout-canceled/',
    mode: 'token',
    tokenType: 'recurring',
    customerInfo: {
      emailAddress: 'john@smartpay.co',
      firstName: 'John',
      lastName: 'Doe',
      firstNameKana: 'ジョン',
      lastNameKana: 'ドエ',
      phoneNumber: '+818000000000',
      dateOfBirth: '2000-01-01',
      legalGender: 'male',
      address: {
        line1: '虎ノ門1-17-1',
        line2: '虎ノ門ヒルズビジネスタワー 15階',
        line3: null,
        line4: null,
        line5: null,
        subLocality: null,
        locality: '港区',
        administrativeArea: '東京都',
        postalCode: '105-6415',
        country: 'JP',
      },
      accountAge: 30,
    },
    reference: 'merchant_token_reference',
  };

  return axios
    .post(url, data, {
      headers: { Authorization: `Basic ${PRIVATE_KEY}` },
    })
    .then((response) => {
      const sessionIdWithSignature = response.data.url.split('/')[3];

      return {
        sessionIdWithSignature,
        pageURL: `${WEB_URL}/${sessionIdWithSignature}`,
      };
    });
};

export const successGetCheckoutSessionMock = (sessionIdWithSignature) =>
  RequestMock()
    .onRequestTo(
      `${API_ENDPOINT}/v1/checkout-sessions/${sessionIdWithSignature}`
    )
    .respond(getCheckoutSession({ sessionIdWithSignature }), 200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, Idempotency-Key',
    });

export const successAuthorizingOrderMock = (orderId) =>
  RequestMock()
    .onRequestTo(`${API_ENDPOINT}/orders/${orderId}/authorizations`)
    .respond(getCheckoutSession({ orderId }).order, 200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers':
        'Content-Type, Authorization, Idempotency-Key',
    });

export const errorPaymentRejectedAuthorizingOrderMock = (orderId) =>
  RequestMock()
    .onRequestTo(`${API_ENDPOINT}/orders/${orderId}/authorizations`)
    .respond(
      {
        publicRejectionCode: 'other',
      },
      200,
      {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, Idempotency-Key',
      }
    );

export const errorOverTheLimitAuthorizingOrderMock = (orderId) =>
  RequestMock()
    .onRequestTo(`${API_ENDPOINT}/orders/${orderId}/authorizations`)
    .respond(
      {
        publicRejectionCode: 'insufficient_balance',
      },
      200,
      {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, Idempotency-Key',
      }
    );

export const errorOverdueInstallmentsAuthorizingOrderMock = (orderId) =>
  RequestMock()
    .onRequestTo(`${API_ENDPOINT}/orders/${orderId}/authorizations`)
    .respond(
      {
        publicRejectionCode: 'past_due_charges',
      },
      200,
      {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers':
          'Content-Type, Authorization, Idempotency-Key',
      }
    );

export const getGlobalSocketId = ClientFunction(() => window.socketId);
