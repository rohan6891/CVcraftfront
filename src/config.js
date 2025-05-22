const config = {
  api: {
    baseUrl: 'https://cvbackend-production-732f.up.railway.app',
    endpoints: {
      auth: {
        login: '/auth/login',
        signup: '/auth/signup',
        verify: '/auth/verify',
      },
      resume: {
        ats: '/resume/ats',
        enhance: '/resume/enhance'
        // create: '/resume/create',
      },
      questions:{
        generate:'/questions/generate_questions'
      },
      report: {
        get: '/report'  // Make sure this matches your backend route
      }
    },
  },
  auth: {
    tokenKey: 'cvcraft_token',    // Key used to store the auth token
    userKey: 'cvcraft_user',      // Key used to store the user email
  }
};

export default config;
