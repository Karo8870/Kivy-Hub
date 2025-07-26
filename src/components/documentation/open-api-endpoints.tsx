import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card'; // Shadcn
import {
  Accordion,
  AccordionItem,
  AccordionContent,
  AccordionTrigger
} from '@/components/ui/accordion';

type OpenAPI = {
  paths: Record<
    string,
    Record<
      string,
      {
        summary?: string;
        description?: string;
        parameters?: any[];
        requestBody?: any;
        responses?: Record<string, any>;
      }
    >
  >;
};

type Props = {
  openApiSpec: OpenAPI;
};

export const OpenApiEndpoints: React.FC<Props> = ({ openApiSpec }) => {
  const endpoints: {
    method: string;
    path: string;
    details: any;
  }[] = [];

  Object.entries(openApiSpec.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, details]) => {
      endpoints.push({ method, path, details });
    });
  });

  return (
    <Accordion type='multiple'>
      {endpoints.map((ep, idx) => (
        <AccordionItem key={idx} value={ep.path + ep.method}>
          <AccordionTrigger>
            <span
              style={{
                fontWeight: 'bold',
                marginRight: 8,
                textTransform: 'uppercase'
              }}
            >
              {ep.method}
            </span>
            <span>{ep.path}</span>
            {ep.details.summary && (
              <span style={{ marginLeft: 8, color: '#888' }}>
                {ep.details.summary}
              </span>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <Card>
              <CardHeader>
                <div>{ep.details.description}</div>
              </CardHeader>
              <CardContent>
                {ep.details.parameters && (
                  <section>
                    <h4>Parameters</h4>
                    <ul>
                      {ep.details.parameters.map((p: any, i: number) => (
                        <li key={i}>
                          <b>{p.name}</b> ({p.in}) - {p.description}{' '}
                          {p.required ? '(required)' : ''}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {ep.details.requestBody && (
                  <section>
                    <h4>Request Body</h4>
                    <pre>{JSON.stringify(ep.details.requestBody, null, 2)}</pre>
                  </section>
                )}
                {ep.details.responses && (
                  <section>
                    <h4>Responses</h4>
                    <ul>
                      {Object.entries(ep.details.responses).map(
                        ([status, resp]: any) => (
                          <li key={status}>
                            <b>{status}:</b> {resp.description || ''}
                          </li>
                        )
                      )}
                    </ul>
                  </section>
                )}
              </CardContent>
            </Card>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default OpenApiEndpoints;
