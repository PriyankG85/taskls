export const decodeUri = (uri: string) => {
  return uri.replace(/%40/g, "%2540").replace(/%2F/g, "%252F");
};
