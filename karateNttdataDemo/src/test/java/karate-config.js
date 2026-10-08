function fn() {
  var env = karate.env; // propiedad de sistema 'karate.env'
  karate.log('karate.env system property was:', env);
  if (!env) {
    env = 'dev';
  }
  var config = {
    env: env,
    // APIs bajo prueba
    urlBase: 'https://petstore.swagger.io/v2',
    bookingUrl: 'https://restful-booker.herokuapp.com',
    // Credenciales públicas de Restful Booker (se pueden sobreescribir con -Dbooker.user / -Dbooker.password)
    authUser: karate.properties['booker.user'] || 'admin',
    authPassword: karate.properties['booker.password'] || 'password123'
  };
  if (env == 'dev') {
    // valores por defecto
  } else if (env == 'qa') {
    // apuntar a otros ambientes aquí
  }
  // Robustez frente a APIs públicas: timeouts y reintentos para "retry until"
  karate.configure('connectTimeout', 15000);
  karate.configure('readTimeout', 30000);
  karate.configure('retry', { count: 10, interval: 1500 });
  return config;
}
