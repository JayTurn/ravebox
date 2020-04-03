/**
 * Notification.model.ts
 * Notification handling of emails.
 */

// Modules.
import * as SIB from 'sib-api-v3-typescript';
import EnvConfig from '../../config/environment/environmentBaseConfig';
import * as http from 'http';

// Enumerators.
import { EmailTemplate } from './Notifications.enum';

// Interfaces.
import { EmailContact } from './Notifications.interface';

/**
 * Notification class.
 */
export default class Notification {
  /**
   * Creates an api instance for submitting the data.
   */
  static CreateSMTPInstance(): SIB.SMTPApi {

    // Create the email client instance.
    const instance: SIB.SMTPApi = new SIB.SMTPApi();

    // Set the api key.
    instance.setApiKey(0, EnvConfig.notifications.key); 

    return instance;
  }

  /**
   * Sends a transactional email.
   *
   * @params { EmailContact } contact - the contact details of the recipient.
   * @params { EmailTemplate } template - the template value for the email.
   * @params { T } params - the params to to be sent with the email.
   */
  static SendTransactionalEmail<T>(
    contact: EmailContact,
    template: EmailTemplate,
    params?: T
  ): void {
    // Create the email client instance.
    const instance: SIB.SMTPApi = Notification.CreateSMTPInstance();

    // Create the smtp email.
    const smtpEmail: SIB.SendSmtpEmail = new SIB.SendSmtpEmail();

    // Define the email parameters.
    smtpEmail.to = [contact];
    smtpEmail.templateId = template;
    // Add parameters if they've been included.
    if (params) {
      smtpEmail.params = params;
    }
    smtpEmail.headers['api-key'] = EnvConfig.notifications.key;
    smtpEmail.headers['content-type'] = 'application/json';
    smtpEmail.headers['accept'] = 'application/json';

    // Send the notification email.
    instance.sendTransacEmail(smtpEmail)
      .then((data: {
        response: http.IncomingMessage,
        body: SIB.CreateSmtpEmail
      }) => {
        console.log(data);
      })
      .catch((error: Error) => {
      })
  }

}
