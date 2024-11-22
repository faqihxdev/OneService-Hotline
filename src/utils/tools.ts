import { RealtimeClient } from '@openai/realtime-api-beta';
import { SetStateAction } from 'jotai';
import { Complaint } from '../types';

export function setupTools(
  client: RealtimeClient,
  addComplaint: (complaint: Partial<Complaint>) => void
) {
  // Add complaints tool
  client.addTool(
    {
      name: 'complaint',
      description: 'Records a detailed complaint from a user.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name of the person making the complaint',
          },
          complaint: {
            type: 'string',
            description: 'The detailed complaint being made',
          },
          location: {
            type: 'string',
            description: 'The location where the incident occurred',
          }
        },
        required: ['name', 'complaint', 'location'],
      },
    },
    async ({ name, complaint, location }: { name: string; complaint: string; location: string }) => {
      const newComplaint: Partial<Complaint> = {
        name,
        complaint,
        location,
      };
      
      addComplaint(newComplaint);
      return { ok: true, message: 'Complaint recorded successfully' };
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