import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonList,
  IonChip,
  IonImg
} from '@ionic/react';
import {
  arrowBack,
  people,
  code,
  shield,
  logoInstagram,
  logoFacebook,
  medical,
  alertCircle,
  server,
  wifi,
  colorPalette,
  heart,
  school
} from 'ionicons/icons';
import { AppLayout } from '../components/shared';

// Import your logo with the correct file path
import appLogo from '../assets/applogotalk.png';
import appOwner from '../assets/honeycupps.png';
import appDra from '../assets/jovic.png';
import appDr from '../assets/marc.png';
import appPartner from '../assets/logo.png';
import appAlex from '../assets/alex.png';  // Add Alex's image
import appAya from '../assets/aya.png';

const Settings: React.FC = () => {
  // Clinic information
  const clinicInfo = {
    name: "Ob-Gyn/Plus",
  doctors: [
    {
      name: "Dr. Marc Bartolabac",
      role: "Orthopedics",
      image: appDr,   // Marc
    },
    {
      name: "Dr. Jovic Bartolabac",
      role: "Obstetrics and Gynecology (OB-GYN)",
      image: appDra,  // Jovic
    }
  ],
    socialMedia: {
      website: "https://obgynplus.com",
      instagram: "https://instagram.com/obgynplus",
      facebook: "https://www.facebook.com/people/Ob-GynPlus-OB-Gyn-Ultrasound/100092980737496/"
    }
  };

  // Logo information
  const logoInfo = {
    designBy: "Honeycupps",
    designerUrl: "https://instagram.com/honeycupps",
  };

  // Development team
const teamMembers = [
  {
    name: "Alexander Novenario",
    role: "Software Engineer",
    image: appAlex,  
    avatarColor: "from-[#7dbdc8] to-[#4e9dbf]"
  },
  {
    name: "Alliyah Faye Valdez",
    role: "Software Engineer",
    image: appAya,  
    avatarColor: "from-[#e2a31d] to-[#ffb347]"
  },
];

  // App requirements
  const appRequirements = [
    {
      title: "Data Storage",
      description: "Local Only",
      details: "All user data stored on device",
      icon: server
    },
    {
      title: "Internet Required",
      description: "For AR Only",
      details: "Augmented Reality features need internet",
      icon: wifi
    }
  ];

  // Disclaimer
  const disclaimer = "This application is designed for educational purposes only to provide general information about puberty and reproductive health. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions you may have regarding medical conditions.";

  return (
    <AppLayout>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">  
            <IonButton onClick={() => window.history.back()}>
              <IonIcon icon={arrowBack} className='text-[#4e9dbf]' />
            </IonButton>
          </IonButtons>
          <IonTitle>Credits</IonTitle>
        </IonToolbar>
      </IonHeader>

      <div className="px-6 py-6">
        {/* App Logo at the top */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-4 p-6 bg-gradient-to-r from-[#7dbdc8]/10 to-[#4e9dbf]/10 rounded-2xl shadow-sm">
            <IonImg 
              src={appLogo} 
              alt="The Talk AR Logo"
              className="object-contain w-40 h-40"
            />
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-[#2c5c6c]">The Talk AR</h1>
            <p className="text-gray-600">Educational Puberty App</p>
          </div>
        </div>

        {/* Medical Partners */}
        <IonCard className="mb-6 rounded-2xl">
          <IonCardHeader>
            <IonCardTitle className="flex items-center text-lg">
              <IonIcon icon={medical} className="mr-2 text-[#4e9dbf]" />
              <span>Medical Partners</span>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="flex items-center gap-4 p-4 mb-6 bg-gradient-to-r from-[#4e9dbf]/10 to-[#7dbdc8]/10 rounded-xl">
              
              {/* Logo */}
              <div className="flex items-center justify-center bg-white shadow-sm w-14 h-14 rounded-xl shrink-0">
                <IonImg 
                  src={appPartner}
                  alt="Clinic Logo"
                  className="object-contain w-10 h-10"
                />
              </div>

              {/* Clinic Info */}
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[#2c5c6c]">
                  {clinicInfo.name}
                </h2>
                <p className="text-sm text-[#2c5c6c]">
                  Medical Advisory & Consultation
                </p>
              </div>
            </div>

            {/* Doctors */}
            <div className="mb-6 space-y-4">
              <h3 className="font-medium text-gray-900">Medical Advisors</h3>

              {clinicInfo.doctors.map((doctor, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center justify-center w-12 h-12 bg-white rounded-full shadow-sm shrink-0">
                    <IonImg 
                      src={doctor.image} 
                      alt={doctor.name}
                      className="object-cover w-10 h-10 rounded-full"
                    />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {doctor.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {doctor.role}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div>
              <h3 className="mb-3 font-medium text-gray-900">Connect with {clinicInfo.name}</h3>
              <div className="flex justify-center space-x-4">
                <IonButton 
                  fill="clear" 
                  size="small"
                  onClick={() => window.open(clinicInfo.socialMedia.instagram, '_blank')}
                  className="text-pink-600"
                >
                  <IonIcon icon={logoInstagram} />
                </IonButton>
                
                <IonButton 
                  fill="clear" 
                  size="small"
                  onClick={() => window.open(clinicInfo.socialMedia.facebook, '_blank')}
                  className="text-blue-600"
                >
                  <IonIcon icon={logoFacebook} />
                </IonButton>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        {/* Logo Design */}
        <IonCard className="mb-6 rounded-2xl">
          <IonCardHeader>
            <IonCardTitle className="flex items-center text-lg">
              <IonIcon icon={colorPalette} className="mr-2 text-[#e2a31d]" />
              <span>Logo Design</span>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="flex items-center justify-center p-4 mb-4 bg-gradient-to-r from-[#e2a31d]/10 to-[#ffb347]/10 rounded-xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#7dbdc8] to-[#4e9dbf] flex items-center justify-center">
                <IonImg 
                  src={appOwner} 
                  alt="The Talk AR Logo"
                  className="object-contain w-40 h-40"
                />
              </div>
            </div>
            
            <div className="text-center">
              <h3 className="mb-2 text-xl font-bold text-gray-900">Designed by</h3>
              <p className="text-2xl font-semibold text-[#e2a31d]">{logoInfo.designBy}</p>
              <p className="mt-2 text-sm text-gray-500">Logo Artist & Designer</p>
            </div>
          </IonCardContent>
        </IonCard>

{/* Development Team */}
<IonCard className="mb-6 rounded-2xl">
  <IonCardHeader>
    <IonCardTitle className="flex items-center text-lg">
      <IonIcon icon={people} className="mr-2 text-[#7dbdc8]" />
      <span>Development Team</span>
    </IonCardTitle>
  </IonCardHeader>
  <IonCardContent>
    <div className="space-y-4">
      {teamMembers.map((member, index) => (
        <div key={index} className="flex items-center p-4 space-x-4 bg-white border border-gray-200 rounded-xl">
          <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-sm shrink-0">
            <IonImg 
              src={member.image}
              alt={member.name}
              className="object-cover rounded-full w-14 h-14"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900">{member.name}</h3>
            <p className="text-sm text-gray-500">{member.role}</p>
          </div>
          <IonChip color="primary" className="bg-[#7dbdc8]/20">
            <IonIcon icon={code} className="mr-1" />
            <span className="text-xs">Team</span>
          </IonChip>
        </div>
      ))}
    </div>
  </IonCardContent>
</IonCard>

        {/* App Requirements */}
        <IonCard className="mb-6 rounded-2xl">
          <IonCardHeader>
            <IonCardTitle className="flex items-center text-lg">
              <IonIcon icon={school} className="mr-2 text-[#4e9dbf]" />
              <span>App Requirements</span>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="space-y-4">
              {appRequirements.map((req, index) => (
                <div key={index} className="flex items-center p-4 space-x-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center w-12 h-12 bg-white shadow-sm rounded-xl">
                    <IonIcon icon={req.icon} className="text-2xl text-[#4e9dbf]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{req.title}</h3>
                    <p className="mb-1 text-sm font-medium text-[#4e9dbf]">{req.description}</p>
                    <p className="text-xs text-gray-500">{req.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </IonCardContent>
        </IonCard>

        {/* Privacy & Legal */}
        <IonCard className="mb-6 rounded-2xl">
          <IonCardHeader>
            <IonCardTitle className="flex items-center text-lg">
              <IonIcon icon={shield} className="mr-2 text-gray-600" />
              <span>Privacy</span>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList lines="none" className="space-y2">
              <div className="p-4 mt-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-center text-gray-600">
                  <span className="font-semibold">Data Privacy:</span> All user data is stored locally on your device. No personal information is transmitted to external servers.
                </p>
              </div>
            </IonList>
          </IonCardContent>
        </IonCard>

        {/* Disclaimer */}
        <IonCard className="mb-6 rounded-2xl">
          <IonCardHeader>
            <IonCardTitle className="flex items-center text-lg">
              <IonIcon icon={alertCircle} className="mr-2 text-amber-600" />
              <span>Important Disclaimer</span>
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="p-4 border bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 rounded-xl">
              <div className="flex items-start mb-3">
                <IonIcon icon={heart} className="flex-shrink-0 w-6 h-6 mt-0.5 text-amber-600" />
                <p className="ml-2 text-sm text-amber-800">{disclaimer}</p>
              </div>
              <div className="pt-3 mt-3 border-t border-amber-200">
                <p className="text-xs font-medium text-center text-amber-900">
                  Consult healthcare professionals for personal medical advice
                </p>
              </div>
            </div>
          </IonCardContent>
        </IonCard>
      </div>
    </AppLayout>
  );
};

export default Settings;