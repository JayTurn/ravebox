/**
 * Notification.model.ts
 * Notification handling of emails.
 */

// Modules.
import * as SIB from 'sib-api-v3-typescript';
import EnvConfig from '../../config/environment/environmentBaseConfig';
import * as http from 'http';

// Enumerators.
import {
  ContactList,
  EmailTemplate
} from './Notifications.enum';

// Interfaces.
import {
  EmailContact,
} from './Notifications.interface';

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
   * Creates an api instance for contact data.
   */
  static CreateContactInstance(): SIB.ContactsApi {

    // Create the contact instance.
    const instance: SIB.ContactsApi = new SIB.ContactsApi();

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
    smtpEmail.headers = {
      'api-key': EnvConfig.notifications.key,
      'content-type': 'application/json',
      'accept': 'application/json'
    };

    // Send the notification email.
    instance.sendTransacEmail(smtpEmail)
      .catch((error: Error) => {
        // Throw the failed email.
        throw error;
      });
  }

  /**
   * Checks if an account exists for the email we are notifying.
   *
   * @param { string } email - the email to be returned or added.
   *
   * @return Promise<string>
   */
  static AddEmailToList(email: string, list: ContactList): Promise<string> {
    return new Promise<string>((resolve: Function, reject: Function) => {
      // Create the contacts instance.
      const instance: SIB.ContactsApi = Notification.CreateContactInstance();

      // Retrieve the contact info.
      instance.getContactInfo(email)
        .then((data: {
          response: http.IncomingMessage;
          body: SIB.GetExtendedContactDetails;
        }) => {
          // Check if the user is already in the specified list.
          const inList: number = data.body.listIds.indexOf(list);

          // If the user is already in the list, let's resolve the request.
          if (inList >= 0) {
            return resolve(email);
          }

          // The user isn't in the list so let's add them.
          instance.addContactToList(list, { emails: [email] })
            .then(() => {
              resolve(email);
            })
            .catch((error: Error) => {
              reject(error);
            })
        })
        .catch((error: {
          response: http.IncomingMessage;
          body: SIB.GetExtendedContactDetails;
        }) => {
          // If the error was that the user couldn't be found, let's add them.
          if (error.response.statusCode === 404) {
            // Create the contact object.
            const createContact: SIB.CreateContact = new SIB.CreateContact();

            // Update the contact object with details we know.
            createContact.email = email;
            createContact.listIds = [list];

            instance.createContact(createContact)
              .then(() => {
                resolve(email);
              })
              .catch((error: Error) => {
                reject(error);
              });
          } else {
            reject(error);
          }
        })
    });
  }

}