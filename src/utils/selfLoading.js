
const SelfLoading={};
SelfLoading.show=function (options) {
  var dom=document.createElement("div");
  dom.style.width='100vw';
  dom.style.height='100vh';
  dom.style.position='fixed';
  dom.style.zIndex='99999999999999';
  dom.style.top='0';
  dom.style.left='0';
  dom.style.background='rgba(0,0,0,.3)';
  document.body.append(dom);
}
export default SelfLoading
