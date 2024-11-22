export interface RealtimeEvent {
  time: string;
  source: 'client' | 'server';
  count?: number;
  event: { [key: string]: any };
}

export interface Complaint {
  id: string;
  name: string;
  complaint: string;
  location: string;
  timestamp: string;
  status: 'pending' | 'resolved';
  audio_url?: string;
}

export interface Case {
  id: string;
  name: string;
  status: 'pending' | 'resolved';
  category: 'Facilities in HDB estates' | 'Roads & Footpaths' | 'Smoking' | 'Construction Sites' | 'Others';
  description: string;
  postal_code: number;
  location: string;
  case_datetime: string;
  audio_url?: string;
}

// {
//   "name": "create_case",
//   "description": "Create a new detailed case, with as much information as possible for caseworkers. All information should be in english or translated to english if other languages or dialects are spoken.",
//   "strict": true,
//   "parameters": {
//     "type": "object",
//     "properties": {
//       "category": {
//         "type": "string",
//         "description": "The type of the case. Choose the most appropriate category for the case.",
//         "enum": [
//           "Facilities in HDB estates",
//           "Roads & Footpaths",
//           "Smoking",
//           "Construction Sites",
//           "Others"
//         ]
//       },
//       "description": {
//         "type": "string",
//         "description": "A detailed description of the case, such that a person with no context or knowledge about this case will understand it. Include as much information as possible for caseworkers, such as special situations whereby the incident occurs if there are possible patterns when the case occurs."
//       },
//       "postal_code": {
//         "type": "number",
//         "description": "The postal code of the location of the case. Should always be a 6-digit number."
//       },
//       "location": {
//         "type": "string",
//         "description": "Can be a relative location, for example, outside the NTUC Fairprice or beside the PCN. At times more detailed location of the case needs to be provided if the user indicates it occurs in their own unit, for example, block number, floor number and unit number."
//       },
//       "case_datetime": {
//         "type": "string",
//         "description": "The date and time of when the incident occurred translated in ISO 8601 format."
//       }
//     },
//     "additionalProperties": false,
//     "required": [
//       "category",
//       "description",
//       "postal_code",
//       "location",
//       "case_datetime"
//     ]
//   }
// }
