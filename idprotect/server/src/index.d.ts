declare module 'passport-local-sequelize' {
  function attachToUser (user: object, fields: {
    usernameField: string,
    hashField: string,
    saltField: string,
  }): void;
}