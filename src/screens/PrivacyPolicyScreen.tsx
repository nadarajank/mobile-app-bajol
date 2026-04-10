import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { useLanguage } from "../localization/LanguageContext";
import { RootStackParamList } from "../navigation/AppNavigator";
import { colors } from "../theme/colors";

type Props = NativeStackScreenProps<RootStackParamList, "PrivacyPolicy">;

const privacyPolicyContent = {
  en: `At Bajol Matrimony, we value your privacy and handle your personal data with care.

1. Information We Collect
We may collect details such as your name, phone number, email address, profile information, partner preferences, photos, and payment-related details needed to provide matrimony services.

2. How We Use Your Information
Your information is used to create and manage your profile, show matching profiles, improve the app experience, contact you regarding account activity, and maintain platform safety.

3. Profile Visibility
Information you add to your matrimony profile may be visible to other registered users. Please avoid sharing highly sensitive personal details in public profile fields.

4. Data Protection
We take reasonable steps to protect your account and personal information. However, no online platform can guarantee absolute security.

5. Sharing of Information
We do not sell your personal information. We may share limited information with service providers or when required by law, regulation, or legal process.

6. Payments
Any paid features or subscriptions are processed through supported payment services. Financial information is handled by the payment provider according to their policies.

7. User Responsibility
Users are responsible for the accuracy of the details they submit and for using contact details and profile data respectfully and lawfully.

8. Account Removal
You may request deletion of your account according to app functionality and applicable legal requirements. Some records may be retained where required for security or compliance.

9. Policy Updates
This Privacy & Policy content may be updated from time to time. Continued use of the app means you accept the latest version.

10. Contact
If you have questions about privacy or policy matters, please contact Bajol Matrimony support through the official app channels.`,
  hi: `बाजोल मैट्रिमोनी में हम आपकी गोपनीयता का सम्मान करते हैं और आपकी व्यक्तिगत जानकारी को सावधानी से संभालते हैं।

1. हम कौन-सी जानकारी लेते हैं
हम आपका नाम, मोबाइल नंबर, ईमेल, प्रोफाइल विवरण, जीवनसाथी की पसंद, फोटो और सेवा देने के लिए जरूरी भुगतान संबंधी जानकारी ले सकते हैं।

2. जानकारी का उपयोग कैसे होता है
आपकी जानकारी प्रोफाइल बनाने, मैच दिखाने, ऐप अनुभव बेहतर करने, खाते से जुड़ी सूचना भेजने और प्लेटफॉर्म की सुरक्षा बनाए रखने के लिए उपयोग की जाती है।

3. प्रोफाइल दृश्यता
आपकी मैट्रिमोनी प्रोफाइल में जो जानकारी आप जोड़ते हैं, वह अन्य रजिस्टर्ड उपयोगकर्ताओं को दिखाई दे सकती है। बहुत संवेदनशील जानकारी सार्वजनिक प्रोफाइल में न डालें।

4. डेटा सुरक्षा
हम आपकी जानकारी की सुरक्षा के लिए उचित कदम उठाते हैं, लेकिन कोई भी ऑनलाइन प्लेटफॉर्म पूर्ण सुरक्षा की गारंटी नहीं दे सकता।

5. जानकारी साझा करना
हम आपकी व्यक्तिगत जानकारी नहीं बेचते। कानून, नियम या सेवा संचालन की आवश्यकता होने पर सीमित जानकारी साझा की जा सकती है।

6. भुगतान
पेड फीचर्स या सब्सक्रिप्शन समर्थित पेमेंट सेवाओं के माध्यम से प्रोसेस होते हैं। वित्तीय जानकारी पेमेंट प्रदाता अपनी नीतियों के अनुसार संभालता है।

7. उपयोगकर्ता की जिम्मेदारी
उपयोगकर्ता अपनी दी गई जानकारी की सत्यता और संपर्क विवरण के उचित तथा कानूनी उपयोग के लिए स्वयं जिम्मेदार हैं।

8. खाता हटाना
ऐप की सुविधा और लागू कानूनी आवश्यकताओं के अनुसार आप खाता हटाने का अनुरोध कर सकते हैं। सुरक्षा या अनुपालन के लिए कुछ रिकॉर्ड रखे जा सकते हैं।

9. नीति अपडेट
यह गोपनीयता और नीति समय-समय पर अपडेट की जा सकती है। ऐप का उपयोग जारी रखने का अर्थ है कि आप नवीनतम संस्करण स्वीकार करते हैं।

10. संपर्क
यदि गोपनीयता या नीति से जुड़ा कोई प्रश्न हो, तो बाजोल मैट्रिमोनी सपोर्ट से आधिकारिक ऐप चैनलों के माध्यम से संपर्क करें।`,
  ta: `Bajol Matrimony உங்கள் தனியுரிமையை மதிக்கிறது; உங்கள் தனிப்பட்ட தகவல்கள் கவனமாக கையாளப்படும்.

1. எங்கள் சேகரிக்கும் தகவல்கள்
பெயர், மொபைல் எண், மின்னஞ்சல், சுயவிவர விவரங்கள், துணை விருப்பங்கள், புகைப்படங்கள் மற்றும் சேவைக்குத் தேவையான கட்டண விவரங்களை நாம் சேகரிக்கலாம்.

2. உங்கள் தகவலை எவ்வாறு பயன்படுத்துகிறோம்
சுயவிவரம் உருவாக்க, பொருத்தமான இணைகளை காட்ட, பயன்பாட்டை மேம்படுத்த, கணக்கு தகவல்களை பகிர, மற்றும் தளத்தின் பாதுகாப்பை பேண உங்கள் தகவல் பயன்படுத்தப்படுகிறது.

3. சுயவிவர காட்சி
நீங்கள் சுயவிவரத்தில் சேர்க்கும் சில தகவல்கள் மற்ற பதிவு செய்யப்பட்ட பயனர்களுக்கு தெரியும். மிகுந்த ரகசியமான தகவல்களை பொது சுயவிவரத்தில் சேர்க்க வேண்டாம்.

4. தரவு பாதுகாப்பு
உங்கள் தகவலை பாதுகாக்க நாங்கள் நியாயமான நடவடிக்கைகள் எடுக்கிறோம். ஆனால் எந்த ஆன்லைன் தளமும் முழுமையான பாதுகாப்பை உறுதி செய்ய முடியாது.

5. தகவல் பகிர்வு
உங்கள் தனிப்பட்ட தகவலை நாங்கள் விற்பனை செய்ய மாட்டோம். சட்டம், விதிமுறை, அல்லது சேவை செயல்பாட்டிற்குத் தேவையான வரம்பிற்குள் மட்டும் பகிரலாம்.

6. கட்டணங்கள்
பணம் செலுத்தும் அம்சங்கள் ஆதரிக்கப்பட்ட கட்டண சேவைகள் மூலம் செயலாக்கப்படுகின்றன. நிதி தகவலை கட்டண சேவை வழங்குநர் தங்களது கொள்கைப்படி கையாளுவார்.

7. பயனர் பொறுப்பு
பயனர்கள் சமர்ப்பிக்கும் தகவல்களின் துல்லியம் மற்றும் தொடர்பு விவரங்களின் சட்டபூர்வமான, மரியாதையான பயன்பாட்டுக்கு அவர்கள் பொறுப்பு.

8. கணக்கு நீக்கம்
பயன்பாட்டு வசதி மற்றும் பொருந்தும் சட்டத்தின் அடிப்படையில் கணக்கை நீக்க கோரலாம். பாதுகாப்பு அல்லது ஒழுங்குமுறை தேவைகளுக்காக சில பதிவுகள் வைக்கப்படலாம்.

9. கொள்கை மாற்றங்கள்
இந்த தனியுரிமை மற்றும் கொள்கை காலைக்காலம் புதுப்பிக்கப்படலாம். பயன்பாட்டை தொடர்ந்து பயன்படுத்துவது புதிய பதிப்பை ஏற்றுக்கொள்வதாகும்.

10. தொடர்புக்கு
தனியுரிமை அல்லது கொள்கை தொடர்பான கேள்விகள் இருந்தால், அதிகாரப்பூர்வ பயன்பாட்டு வாயில்களில் Bajol Matrimony ஆதரவை தொடர்பு கொள்ளவும்.`,
} as const;

export function PrivacyPolicyScreen({ navigation }: Props) {
  const { language, copy } = useLanguage();

  return (
    <Screen>
      <Card>
        <Text style={styles.title}>{copy.nav.privacyPolicy}</Text>
        <Text style={styles.body}>{privacyPolicyContent[language]}</Text>
        <View style={styles.gap} />
        <Button label="Back" onPress={() => navigation.goBack()} />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    marginBottom: 16,
  },
  body: {
    color: colors.text,
    fontSize: 16,
    lineHeight: 26,
  },
  gap: {
    height: 16,
  },
});
