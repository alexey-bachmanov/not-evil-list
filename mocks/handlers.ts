import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('/api/businesses', () => {
    return HttpResponse.json({
      success: true,
    });
  }),
  http.get('/api/businesses/999', () => {
    return HttpResponse.json({
      success: true,
    });
  }),
];
