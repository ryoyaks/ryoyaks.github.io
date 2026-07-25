// A one-shot gate so the hero's pull-apart intro waits for the boot-log curtain
// to lift. BootIntro calls releaseIntro() as the curtain starts sliding away;
// HeroG3 awaits introGate before playing. If the boot never mounts, HeroG3's own
// fallback timer plays anyway, so the hero can never get stuck hidden.
let resolve;
export const introGate = new Promise((r) => {
  resolve = r;
});
export const releaseIntro = () => {
  if (resolve) {
    resolve();
    resolve = null;
  }
};
