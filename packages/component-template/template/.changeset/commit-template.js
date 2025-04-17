module.exports = {
  // getAddMessage: (arg) => {
  //   return `feat: ${arg.summary}`
  // },
  getVersionMessage: (arg) => {
    return `build: ${arg.changesets[0].summary}`
  }
}