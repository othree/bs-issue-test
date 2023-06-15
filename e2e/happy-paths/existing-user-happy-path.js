/* eslint-disable no-param-reassign */
import {
  createCheckoutSession,
  getUA,
  getLocation,
  getReferrer,
  successAuthorizingOrderMock,
  successGetCheckoutSessionMock,
} from '../utils/helpers';
import { Selector } from 'testcafe';
import { WEB_URL, FEATURES } from '../utils/constants';
import uaParser from 'ua-parser-js';

// prettier-ignore
// eslint-disable-next-line
fixture`Getting Started`
  .page(WEB_URL)
  .beforeEach(async (t) => {
    const {
      pageURL,
      orderId,
      sessionIdWithSignature
    } = await createCheckoutSession();
    await t
      .addRequestHooks([
        successGetCheckoutSessionMock(sessionIdWithSignature),
        successAuthorizingOrderMock(orderId)
      ])
      .navigateTo(pageURL)
      // wait 3 seconds for the first browser initiation
      .wait(3000);
  });

test('Existing user - Happy path', async (t) => {
  const ua = await getUA();
  const deviceType = uaParser(ua).device.type;
  /**
   * LoginScreen
   */
  const email = `smartpay+test1@smartpay.co`;
  const emailInput = Selector('#ip_email');

  if (FEATURES.isPreferAppPromptFeatureEnabled && deviceType === 'mobile') {
    await t.click('#not_prefer_app');
  }

  await t
    .expect(emailInput.exists)
    .ok()
    .selectText(emailInput)
    .pressKey('delete')
    .typeText(emailInput, email)
    .expect(emailInput.value)
    .eql(email)

    .click('#btn_submit')
    .expect(emailInput.exists)
    .notOk({ timeout: 10000 })

    .expect(getLocation())
    .contains('/password');

  /**
   * PasswordScreen
   */
  const password = 'smartpayftw';
  const passwordInput = Selector('#ip_password');

  await t
    .expect(passwordInput.exists)
    .ok()
    .click(Selector('#ic_eye'))
    .selectText(passwordInput)
    .typeText(passwordInput, password)
    .expect(passwordInput.value)
    .eql(password)

    .click('#btn_submit')
    .expect(passwordInput.exists)
    .notOk({ timeout: 5000 })

    .expect(getLocation())
    .contains('/payment');

  /**
   * PaymentApprovalScreen
   */
  const submitPaymentBtn = Selector('#btn_submit_payment');

  await t
    .click('#btn_submit_payment')
    .expect(submitPaymentBtn.exists)
    .notOk({ timeout: 10000 })
    .wait(3000)

    .expect(getLocation())
    .contains('/checkout-successful/')
    .expect(getReferrer())
    .contains('/payment-success');
});
