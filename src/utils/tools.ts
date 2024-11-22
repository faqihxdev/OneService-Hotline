import { RealtimeClient } from '@openai/realtime-api-beta';
import { Case } from '../types';

export function setupTools(
  client: RealtimeClient,
  addCase: (case_: Partial<Case>) => void
) {
  // Add cases tool
  client.addTool(
    {
      name: 'create_case',
      description: 'Create a new detailed case, with as much information as possible for caseworkers. All information should be in english or translated to english if other languages or dialects are spoken.',
      parameters: {
        type: 'object',
        properties: {
          category: {
            type: 'string',
            description: 'The type of the case. Choose the most appropriate category for the case.',
            enum: [
              'Facilities in HDB estates',
              'Roads & Footpaths',
              'Smoking',
              'Construction Sites',
              'Others'
            ]
          },
          description: {
            type: 'string',
            description: 'A detailed description of the case, such that a person with no context or knowledge about this case will understand it. Include as much information as possible for caseworkers, such as special situations whereby the incident occurs if there are possible patterns when the case occurs.'
          },
          postal_code: {
            type: 'number',
            description: 'The postal code of the location of the case. Should always be a 6-digit number.'
          },
          location: {
            type: 'string',
            description: 'Can be a relative location, for example, outside the NTUC Fairprice or beside the PCN. At times more detailed location of the case needs to be provided if the user indicates it occurs in their own unit, for example, block number, floor number and unit number.'
          },
          case_datetime: {
            type: 'string',
            description: 'The date and time of when the incident occurred translated in ISO 8601 format.'
          }
        },
        required: [
          'category',
          'description',
          'postal_code',
          'location',
          'case_datetime'
        ]
      }
    },
    async (caseData: Partial<Case>) => {
      addCase(caseData);
      return { ok: true, message: 'Case created successfully' };
    }
  );

  // // Add weather tool
  // client.addTool(
  //   {
  //     name: 'get_weather',
  //     description: 'Retrieves the weather for a given lat, lng coordinate pair. Specify a label for the location.',
  //     parameters: {
  //       type: 'object',
  //       properties: {
  //         lat: { type: 'number', description: 'Latitude' },
  //         lng: { type: 'number', description: 'Longitude' },
  //         location: { type: 'string', description: 'Name of the location' },
  //       },
  //       required: ['lat', 'lng', 'location'],
  //     },
  //   },
  //   async ({ lat, lng, location }: { [key: string]: any }) => {
  //     setMarker({ lat, lng, location });
  //     setCoords({ lat, lng, location });
  //     const result = await fetch(
  //       `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,wind_speed_10m`
  //     );
  //     const json = await result.json();
  //     const temperature = {
  //       value: json.current.temperature_2m as number,
  //       units: json.current_units.temperature_2m as string,
  //     };
  //     const wind_speed = {
  //       value: json.current.wind_speed_10m as number,
  //       units: json.current_units.wind_speed_10m as string,
  //     };
  //     setMarker({ lat, lng, location, temperature, wind_speed });
  //     return json;
  //   }
  // );
}