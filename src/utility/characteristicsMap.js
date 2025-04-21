import vit from "../assets/characteristics/vit.png";
import fire from "../assets/characteristics/fire.png";
import earth from "../assets/characteristics/earth.png";
import air from "../assets/characteristics/air.png";
import water from "../assets/characteristics/water.png";
import wis from "../assets/characteristics/wis.png";
import pp from "../assets/characteristics/pp.png";
import heals from "../assets/characteristics/heals.png";
import critDamage from "../assets/characteristics/cridam.png";
import critHits from "../assets/characteristics/cri.png";
import summons from "../assets/characteristics/summons.png";
import range from "../assets/characteristics/range.png";
import ap from "../assets/characteristics/ap.png";
import mp from "../assets/characteristics/mp.png";
import apReduction from "../assets/characteristics/apred.png";
import mpReduction from "../assets/characteristics/mpred.png";
import lock from "../assets/characteristics/lock.png";
import dodge from "../assets/characteristics/dodge.png";
import apres from "../assets/characteristics/apres.png";
import mpres from "../assets/characteristics/mpres.png";
import neures from "../assets/characteristics/neures.png";
import fireres from "../assets/characteristics/fireres.png";
import earthres from "../assets/characteristics/earthres.png";
import airres from "../assets/characteristics/airres.png";
import waterres from "../assets/characteristics/waterres.png";
import power from "../assets/characteristics/power.png";
import spelldam from "../assets/characteristics/spelldam.png";
import rangedam from "../assets/characteristics/rangedam.png";
import meleedam from "../assets/characteristics/meleedam.png";
import weapdam from "../assets/characteristics/weapdam.png";
import pshres from "../assets/characteristics/pshres.png";
import rangeres from "../assets/characteristics/rangeres.png";
import meleeres from "../assets/characteristics/meleeres.png";
import initiative from "../assets/characteristics/initiative.png";
import crires from "../assets/characteristics/crires.png";

const characteristicsMap = {
  Vitality: vit,
  Initiative: initiative,
  Intelligence: fire,
  Strength: earth,
  Agility: air,
  Chance: water,
  Wisdom: wis,
  Prospecting: pp,
  "Fire Damage": fire,
  "Fire steal": fire,
  "Earth Damage": earth,
  "Earth steal": earth,
  "Air Damage": air,
  "Air steal": air,
  "Water Damage": water,
  "Water steal": water,
  Heal: heals,
  "Critical Damage": critDamage,
  "% Critical": critHits,
  Summons: summons,
  Range: range,
  AP: ap,
  MP: mp,
  "AP Reduction": apReduction,
  "MP Reduction": mpReduction,
  Lock: lock,
  Dodge: dodge,
  "AP Parry": apres,
  "MP Parry": mpres,
  "Neutral Resistance": neures,
  "% Neutral Resistance": neures,
  "Fire Resistance": fireres,
  "% Fire Resistance": fireres,
  "Earth Resistance": earthres,
  "% Earth Resistance": earthres,
  "Air Resistance": airres,
  "% Air Resistance": airres,
  "Water Resistance": waterres,
  "% Water Resistance": waterres,
  "Neutral Damage": neures,
  "Air damage": air,
  "Earth damage": earth,
  "Fire damage": fire,
  "Water damage": water,
  Power: power,
  "% Spell Damage": spelldam,
  "% Ranged Damage": rangedam,
  "% Melee Damage": meleedam,
  "% Weapon Damage": weapdam,
  "Pushback Resistance": pshres,
  "Critical Resistance": crires,
  "% Ranged Resistance": rangeres,
  "% Melee Resistance": meleeres,
};

const getCharacteristicImage = (characteristic) => {
  return characteristicsMap[characteristic] || null;
};

export default getCharacteristicImage;
