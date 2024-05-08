export const sendPushNotification = async (params): void => {
  const {data, receiverIds, template_id, custom_data} = params;
  console.log('DATA ', data);
  console.log('receiverIds ', receiverIds);
  console.log('template_id ', template_id);
  console.log('custom_data ', custom_data);

  const body = {
    data,
    include_external_user_ids: receiverIds,
    template_id,
    custom_data,
  };
  const cookieToken = await SharetribeTokenStore({
    clientId: SHARETRIBE_SDK_CLIENT_ID,
  }).getCookieToken();

  const res = await sendNotificationViaTemplate(body, cookieToken);
  console.log('res', res);
};
