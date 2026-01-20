// // src/pages/RegisterPage.tsx
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { 
//   User, 
//   Mail, 
//   Lock, 
//   Eye, 
//   EyeOff, 
//   Building, 
//   Phone,
//   CheckCircle,
//   XCircle
// } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';

// const RegisterPage: React.FC = () => {
//   const { registerAppOwner } = useAuth();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     organizationName: '',
//     phoneNumber: '',
//     accountType: 'government',
//     acceptTerms: false
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [passwordStrength, setPasswordStrength] = useState(0);
//   const [formStep, setFormStep] = useState(1);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value, type } = e.target;
    
//     if (type === 'checkbox') {
//       const target = e.target as HTMLInputElement;
//       setFormData(prev => ({
//         ...prev,
//         [name]: target.checked
//       }));
//     } else {
//       setFormData(prev => ({
//         ...prev,
//         [name]: value
//       }));
//     }

//     // Check password strength
//     if (name === 'password') {
//       const strength = calculatePasswordStrength(value);
//       setPasswordStrength(strength);
//     }
//   };

//   const calculatePasswordStrength = (password: string): number => {
//     let strength = 0;
//     if (password.length >= 8) strength += 25;
//     if (/[A-Z]/.test(password)) strength += 25;
//     if (/[0-9]/.test(password)) strength += 25;
//     if (/[^A-Za-z0-9]/.test(password)) strength += 25;
//     return strength;
//   };

//   const getPasswordStrengthColor = (strength: number) => {
//     if (strength < 50) return 'bg-red-500';
//     if (strength < 75) return 'bg-yellow-500';
//     return 'bg-green-500';
//   };

//   const getPasswordStrengthText = (strength: number) => {
//     if (strength < 50) return 'Weak';
//     if (strength < 75) return 'Medium';
//     return 'Strong';
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (formStep < 3) {
//       return;
//     }
//     if (formData.password !== formData.confirmPassword) {
//       return;
//     }
//     // Use registerAppOwner instead of login
//     // Combine firstName and lastName for 'name' field required by API
//     await registerAppOwner({
//       email: formData.email,
//       password: formData.password,
//       name: `${formData.firstName} ${formData.lastName}`
//     });
//     navigate('/dashboard', { replace: true });
//   };

//   const nextStep = () => {
//     setFormStep(prev => Math.min(prev + 1, 3));
//   };

//   const prevStep = () => {
//     setFormStep(prev => Math.max(prev - 1, 1));
//   };

//   const accountTypes = [
//     { value: 'government', label: 'Government Agency', icon: '🏛️' },
//     { value: 'education', label: 'Educational Institution', icon: '🎓' },
//     { value: 'other', label: 'Other Public Sector', icon: '🏢' }
//   ];

//   const passwordRequirements = [
//     { text: 'At least 8 characters', met: formData.password.length >= 8 },
//     { text: 'Contains uppercase letter', met: /[A-Z]/.test(formData.password) },
//     { text: 'Contains number', met: /[0-9]/.test(formData.password) },
//     { text: 'Contains special character', met: /[^A-Za-z0-9]/.test(formData.password) }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//       <div className="max-w-4xl w-full">
//         <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white">
//             <div className="flex items-center justify-center gap-3 mb-6">
//               <div className="h-12 w-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
//                 <span className="text-2xl font-bold">L</span>
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold">Lucidis Platform</h1>
//                 <p className="text-indigo-100">AI-Powered Citizen Engagement</p>
//               </div>
//             </div>
            
//             {/* Progress Steps */}
//             <div className="flex items-center justify-center mb-6">
//               {[1, 2, 3].map((step) => (
//                 <div key={step} className="flex items-center">
//                   <div className={`flex items-center justify-center h-10 w-10 rounded-full border-2 ${
//                     step <= formStep 
//                       ? 'bg-white text-indigo-600 border-white' 
//                       : 'border-white/50 text-white/50'
//                   } font-bold`}>
//                     {step < formStep ? '✓' : step}
//                   </div>
//                   {step < 3 && (
//                     <div className={`h-1 w-16 ${
//                       step < formStep ? 'bg-white' : 'bg-white/30'
//                     }`} />
//                   )}
//                 </div>
//               ))}
//             </div>

//             <div className="text-center">
//               <h2 className="text-xl font-semibold mb-2">
//                 {formStep === 1 && 'Create Your Account'}
//                 {formStep === 2 && 'Organization Details'}
//                 {formStep === 3 && 'Security Settings'}
//               </h2>
//               <p className="text-indigo-100">
//                 {formStep === 1 && 'Enter your personal information to get started'}
//                 {formStep === 2 && 'Tell us about your organization'}
//                 {formStep === 3 && 'Set up your security credentials'}
//               </p>
//             </div>
//           </div>

//           {/* Form Content */}
//           <div className="p-8">
//             <form onSubmit={handleSubmit}>
//               {formStep === 1 && (
//                 <div className="space-y-6">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         <div className="flex items-center gap-2">
//                           <User className="h-4 w-4 text-gray-400" />
//                           First Name
//                         </div>
//                       </label>
//                       <input
//                         type="text"
//                         name="firstName"
//                         value={formData.firstName}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         placeholder="John"
//                       />
//                     </div>

//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Last Name
//                       </label>
//                       <input
//                         type="text"
//                         name="lastName"
//                         value={formData.lastName}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                         placeholder="Smith"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <div className="flex items-center gap-2">
//                         <Mail className="h-4 w-4 text-gray-400" />
//                         Email Address
//                       </div>
//                     </label>
//                     <input
//                       type="email"
//                       name="email"
//                       value={formData.email}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                       placeholder="you@organization.gov"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <div className="flex items-center gap-2">
//                         <Phone className="h-4 w-4 text-gray-400" />
//                         Phone Number
//                       </div>
//                     </label>
//                     <input
//                       type="tel"
//                       name="phoneNumber"
//                       value={formData.phoneNumber}
//                       onChange={handleChange}
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                       placeholder="+1 (555) 123-4567"
//                     />
//                   </div>
//                 </div>
//               )}

//               {formStep === 2 && (
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <div className="flex items-center gap-2">
//                         <Building className="h-4 w-4 text-gray-400" />
//                         Organization Name
//                       </div>
//                     </label>
//                     <input
//                       type="text"
//                       name="organizationName"
//                       value={formData.organizationName}
//                       onChange={handleChange}
//                       required
//                       className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//                       placeholder="e.g., City of Frisco"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-4">
//                       Account Type
//                     </label>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                       {accountTypes.map((type) => (
//                         <label
//                           key={type.value}
//                           className={`relative cursor-pointer border-2 rounded-xl p-4 transition-all ${
//                             formData.accountType === type.value
//                               ? 'border-indigo-500 bg-indigo-50'
//                               : 'border-gray-200 hover:border-gray-300'
//                           }`}
//                         >
//                           <input
//                             type="radio"
//                             name="accountType"
//                             value={type.value}
//                             checked={formData.accountType === type.value}
//                             onChange={handleChange}
//                             className="sr-only"
//                           />
//                           <div className="text-center">
//                             <div className="text-2xl mb-2">{type.icon}</div>
//                             <div className="font-medium text-gray-900">{type.label}</div>
//                           </div>
//                           {formData.accountType === type.value && (
//                             <div className="absolute top-2 right-2">
//                               <CheckCircle className="h-5 w-5 text-indigo-600" />
//                             </div>
//                           )}
//                         </label>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
//                     <h3 className="font-medium text-blue-900 mb-2">Government & Education Focus</h3>
//                     <p className="text-sm text-blue-700">
//                       Lucidis is specifically designed for government agencies and educational institutions. 
//                       Features include citizen authentication (ID.me), SOC 2 compliance, and workflows 
//                       tailored for public sector needs.
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {formStep === 3 && (
//                 <div className="space-y-6">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       <div className="flex items-center gap-2">
//                         <Lock className="h-4 w-4 text-gray-400" />
//                         Password
//                       </div>
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showPassword ? 'text' : 'password'}
//                         name="password"
//                         value={formData.password}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-10"
//                         placeholder="Create a strong password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowPassword(!showPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         {showPassword ? (
//                           <EyeOff className="h-5 w-5" />
//                         ) : (
//                           <Eye className="h-5 w-5" />
//                         )}
//                       </button>
//                     </div>

//                     {/* Password Strength Meter */}
//                     {formData.password && (
//                       <div className="mt-3">
//                         <div className="flex justify-between text-sm mb-1">
//                           <span className="text-gray-600">Password strength:</span>
//                           <span className={`font-medium ${
//                             passwordStrength < 50 ? 'text-red-600' :
//                             passwordStrength < 75 ? 'text-yellow-600' :
//                             'text-green-600'
//                           }`}>
//                             {getPasswordStrengthText(passwordStrength)}
//                           </span>
//                         </div>
//                         <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
//                           <div
//                             className={`h-full ${getPasswordStrengthColor(passwordStrength)} transition-all duration-300`}
//                             style={{ width: `${passwordStrength}%` }}
//                           />
//                         </div>
//                       </div>
//                     )}

//                     {/* Password Requirements */}
//                     <div className="mt-4 space-y-2">
//                       {passwordRequirements.map((req, index) => (
//                         <div key={index} className="flex items-center gap-2 text-sm">
//                           {req.met ? (
//                             <CheckCircle className="h-4 w-4 text-green-500" />
//                           ) : (
//                             <XCircle className="h-4 w-4 text-gray-300" />
//                           )}
//                           <span className={req.met ? 'text-green-600' : 'text-gray-500'}>
//                             {req.text}
//                           </span>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Confirm Password
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showConfirmPassword ? 'text' : 'password'}
//                         name="confirmPassword"
//                         value={formData.confirmPassword}
//                         onChange={handleChange}
//                         required
//                         className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-10"
//                         placeholder="Re-enter your password"
//                       />
//                       <button
//                         type="button"
//                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//                         className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                       >
//                         {showConfirmPassword ? (
//                           <EyeOff className="h-5 w-5" />
//                         ) : (
//                           <Eye className="h-5 w-5" />
//                         )}
//                       </button>
//                     </div>
                    
//                     {formData.password && formData.confirmPassword && (
//                       <div className="mt-2 text-sm">
//                         {formData.password === formData.confirmPassword ? (
//                           <div className="flex items-center gap-2 text-green-600">
//                             <CheckCircle className="h-4 w-4" />
//                             Passwords match
//                           </div>
//                         ) : (
//                           <div className="flex items-center gap-2 text-red-600">
//                             <XCircle className="h-4 w-4" />
//                             Passwords do not match
//                           </div>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   <div className="flex items-start gap-3">
//                     <input
//                       type="checkbox"
//                       name="acceptTerms"
//                       checked={formData.acceptTerms}
//                       onChange={handleChange}
//                       required
//                       className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//                     />
//                     <label className="text-sm text-gray-600">
//                       I agree to the{' '}
//                       <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
//                         Terms of Service
//                       </a>{' '}
//                       and{' '}
//                       <a href="#" className="text-indigo-600 hover:text-indigo-700 font-medium">
//                         Privacy Policy
//                       </a>
//                       . I understand that this platform is for government and educational use.
//                     </label>
//                   </div>
//                 </div>
//               )}

//               {/* Form Navigation */}
//               <div className="mt-8 flex justify-between">
//                 {formStep > 1 ? (
//                   <button
//                     type="button"
//                     onClick={prevStep}
//                     className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
//                   >
//                     Back
//                   </button>
//                 ) : (
//                   <Link
//                     to="/login"
//                     className="px-6 py-3 text-gray-600 hover:text-gray-900 transition font-medium"
//                   >
//                     Already have an account?
//                   </Link>
//                 )}

//                 {formStep < 3 ? (
//                   <button
//                     type="button"
//                     onClick={nextStep}
//                     className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
//                   >
//                     Continue
//                   </button>
//                 ) : (
//                   <button
//                     type="submit"
//                     disabled={!formData.acceptTerms}
//                     className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
//                   >
//                     Create Account
//                   </button>
//                 )}
//               </div>
//             </form>

//             {/* Step Indicators (Mobile) */}
//             <div className="mt-8 flex justify-center gap-2 md:hidden">
//               {[1, 2, 3].map((step) => (
//                 <div
//                   key={step}
//                   className={`h-2 w-8 rounded-full ${
//                     step === formStep
//                       ? 'bg-indigo-600'
//                       : step < formStep
//                       ? 'bg-indigo-300'
//                       : 'bg-gray-200'
//                   }`}
//                 />
//               ))}
//             </div>
//           </div>

//           {/* Footer */}
//           <div className="bg-gray-50 border-t border-gray-200 p-6 text-center">
//             <p className="text-sm text-gray-600">
//               Need help?{' '}
//               <a href="mailto:support@lucidis.com" className="text-indigo-600 hover:text-indigo-700 font-medium">
//                 Contact our team
//               </a>
//             </p>
//             <p className="text-xs text-gray-500 mt-2">
//               By registering, you agree to our SOC 2 compliance standards and data protection policies.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RegisterPage;
