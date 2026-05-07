import { auth } from "@/app/_lib/auth";
import { getWelcomePackCoupons, getGuestCoupons } from "@/app/_lib/data-service";
import WelcomePackModal from "./WelcomePackModal";

export default async function WelcomePackBanner() {
  const session = await auth();
  const coupons = await getWelcomePackCoupons();
  if (!coupons.length) return null;

  let claimedIds = [];
  let usedIds = [];
  if (session) {
    const guestCoupons = await getGuestCoupons(session.user.guestId);
    claimedIds = guestCoupons.map((gc) => gc.coupon_id);
    usedIds = guestCoupons.filter((gc) => gc.used).map((gc) => gc.coupon_id);
  }

  return (
    <WelcomePackModal
      coupons={coupons}
      claimedIds={claimedIds}
      usedIds={usedIds}
      isLoggedIn={!!session}
    />
  );
}
