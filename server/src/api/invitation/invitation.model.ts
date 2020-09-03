/**
 * invitation.model.js
 * Invitation Class to manage the user model.
 */
import EnvConfig from '../../config/environment/environmentBaseConfig';
import * as Mongoose from 'mongoose';

// Enumerators.
import { InvitationStatus } from './invitation.enum';

// Interfaces.
import { InvitationDetailsDocument } from './invitation.interface';

// Get the Mongoose Shema method.
const Schema = Mongoose.Schema;

// Create the User Schema to be the base for the User model.
const InvitationSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
  },
  existingChannel: {
    type: String,
    default: ''
  },
  invitedBy: {
    type: String, 
    default: EnvConfig.admin
  },
  status: {
    type: InvitationStatus,
    default: InvitationStatus.WAITING
  }
});

// Declare the invitation mongoose model.
const Invitation: Mongoose.Model<InvitationDetailsDocument> = Mongoose.model('Invitation', InvitationSchema);

// Declare the Invitation mongoose model.
export default Invitation;
