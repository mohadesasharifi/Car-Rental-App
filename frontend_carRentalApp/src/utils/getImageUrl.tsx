import fullSizeSedan from "../storage/FULL_SIZE_SEDAN.jpg";
import fullSizeSuv from "../storage/FULL_SIZE_SUV.jpg";
import compactSuv from "../storage/COMPACT_SUV.jpg";
import intermediateSuv from "../storage/INTERMEDIATE_SUV.jpg";
import economy from "../storage/ECONOMY.jpg";
import compactAuto from "../storage/COMPACT_AUTO.jpg";
import other from "../storage/OTHER.jpg";

const getImageUrl = (category: string): string => {
    switch (category) {
        case "FULL_SIZE_SEDAN":
            return fullSizeSedan
        case "FULL_SIZE_SUV":
            return fullSizeSuv
        case "COMPACT_SUV":
            return compactSuv
        case "INTERMEDIATE_SUV":
            return intermediateSuv
        case "ECONOMY":
            return economy
        case "COMPACT_AUTO":
            return compactAuto
        default:
            return other
    }
};
export default getImageUrl;