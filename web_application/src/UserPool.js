import { CognitoUserPool } from 'amazon-cognito-identity-js';
import config from './config.json';

const poolData = {
  UserPoolId: config.awsCognito.UserPoolId,
  ClientId: config.awsCognito.ClientId,
};
export default new CognitoUserPool(poolData);