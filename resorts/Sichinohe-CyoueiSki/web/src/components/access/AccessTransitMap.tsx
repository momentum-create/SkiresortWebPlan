import { getLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import type { AccessMapData } from "@/lib/resort-data";
import { AccessMapHeroShell } from "./AccessMapHeroShell";

type Props = {
  map: AccessMapData;
};

export async function AccessTransitMap({ map }: Props) {
  const locale = await getLocale();
  const t = await getTranslations("access.map");
  const en = locale === "en";
  const minutes = map.taxiMinutes ?? map.driveMinutes;

  return (
    <AccessMapHeroShell
      map={map}
      labels={{
        heroEyebrow: t("heroEyebrow"),
        heroHeadline: t("heroHeadline", { minutes }),
        heroSub: t("heroSub"),
        navFromHere: t("navFromHere"),
        navApple: t("navApple"),
        openGoTaxi: t("openGoTaxi"),
        stationRoute: t("stationRoute"),
        goTaxiNote: t("goTaxiNote"),
        parking: t("parking"),
        parkingValue: en ? map.parkingEn : map.parking,
        sourceNote: t("sourceNote"),
      }}
    />
  );
}
