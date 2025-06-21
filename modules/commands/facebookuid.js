module.exports.config = {
  'name': 'fuid',
  'version': "1.0.0",
  'hasPermssion': 0x0,
  'credits': "𝙈𝙧𝙏𝙤𝙢𝙓𝙭𝙓 𝙍𝙖𝙩𝙪𝙡 𝙃𝙖𝙨𝙨𝙖𝙣",
  'usePrefix': true,
  'description': "get uid using facebook link",
  'commandCategory': "...",
  'cooldowns': 0x5
};
module.exports.run = async ({
  api: _0x344b50,
  event: _0x3e9ffe,
  args: _0x17b10f
}) => {
  const _0x2836ed = global.nodemodule.axios;
  let _0x35b19 = _0x17b10f.join(" ");
  const _0x4f78e2 = await _0x2836ed.get("https://api.phamvandien.xyz/finduid?url=" + _0x35b19);
  var _0x1f6004 = _0x4f78e2.data.id;
  return _0x344b50.sendMessage('' + _0x1f6004, _0x3e9ffe.threadID, _0x3e9ffe.messageID);
};