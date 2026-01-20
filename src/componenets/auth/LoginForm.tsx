// // src/components/auth/LoginForm.tsx
// import React, { useState } from 'react';
// import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

// interface LoginFormProps {
//   onSubmit?: (data: { email: string; password: string }) => void;
// }

// const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [rememberMe, setRememberMe] = useState(false);

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit?.({ email, password });
//     // API integration will go here
//   };

//   return (
//     <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//       <div className="space-y-4">
//         <div>
//           <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//             Email Address
//           </label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Mail className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               id="email"
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//               placeholder="you@example.com"
//             />
//           </div>
//         </div>

//         <div>
//           <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
//             Password
//           </label>
//           <div className="relative">
//             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//               <Lock className="h-5 w-5 text-gray-400" />
//             </div>
//             <input
//               id="password"
//               type={showPassword ? 'text' : 'password'}
//               required
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
//               placeholder="••••••••"
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center"
//             >
//               {showPassword ? (
//                 <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//               ) : (
//                 <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="flex items-center justify-between">
//         <div className="flex items-center">
//           <input
//             id="remember-me"
//             type="checkbox"
//             checked={rememberMe}
//             onChange={(e) => setRememberMe(e.target.checked)}
//             className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
//           />
//           <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
//             Remember me
//           </label>
//         </div>

//         <div className="text-sm">
//           <a href="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
//             Forgot password?
//           </a>
//         </div>
//       </div>

//       <div>
//         <button
//           type="submit"
//           className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium transition"
//         >
//           Sign in
//         </button>
//       </div>
//     </form>
//   );
// };

// export default LoginForm;