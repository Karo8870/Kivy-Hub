'use client';

import React, { useState } from 'react';
import { Search, Server, Info, Code, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { Separator } from '@radix-ui/react-menu';
import { Input } from '@/components/ui/input';

interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    description?: string;
    version: string;
    contact?: {
      name?: string;
      email?: string;
      url?: string;
    };
  };
  servers?: Array<{
    url: string;
    description?: string;
  }>;
  paths: Record<string, Record<string, any>>;
  components?: {
    schemas?: Record<string, any>;
    securitySchemes?: Record<string, any>;
  };
  tags?: Array<{
    name: string;
    description?: string;
  }>;
}

interface OpenAPIViewerProps {
  spec: OpenAPISpec;
}

const methodColors: Record<string, string> = {
  get: 'bg-green-100 text-green-800 border-green-200',
  post: 'bg-blue-100 text-blue-800 border-blue-200',
  put: 'bg-orange-100 text-orange-800 border-orange-200',
  patch: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  delete: 'bg-red-100 text-red-800 border-red-200',
  head: 'bg-purple-100 text-purple-800 border-purple-200',
  options: 'bg-gray-100 text-gray-800 border-gray-200'
};

const ParameterDisplay: React.FC<{ parameters: any[] }> = ({ parameters }) => {
  if (!parameters || parameters.length === 0) return null;

  return (
    <div className='space-y-3'>
      <h4 className='text-sm font-medium'>Parameters</h4>
      <div className='space-y-2'>
        {parameters.map((param, index) => (
          <div key={index} className='bg-muted/50 rounded-lg border p-3'>
            <div className='mb-1 flex items-center gap-2'>
              <span className='font-mono text-sm'>{param.name}</span>
              <Badge variant='outline' className='text-xs'>
                {param.in}
              </Badge>
              {param.required && (
                <Badge variant='destructive' className='text-xs'>
                  required
                </Badge>
              )}
            </div>
            {param.description && (
              <p className='text-muted-foreground mb-1 text-sm'>
                {param.description}
              </p>
            )}
            <div className='text-muted-foreground text-xs'>
              Type: {param.schema?.type || param.type || 'any'}
              {param.schema?.format && ` (${param.schema.format})`}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SchemaDisplay: React.FC<{ schema: any; title?: string }> = ({
  schema,
  title
}) => {
  if (!schema) return null;

  const renderSchema = (obj: any, level = 0): React.ReactNode => {
    if (typeof obj !== 'object') return String(obj);

    return (
      <div className={`${level > 0 ? 'ml-4 border-l pl-3' : ''}`}>
        {Object.entries(obj).map(([key, value]: [string, any]) => (
          <div key={key} className='mb-2'>
            <span className='font-mono text-sm'>{key}:</span>{' '}
            {typeof value === 'object' && value !== null ? (
              <div className='mt-1'>{renderSchema(value, level + 1)}</div>
            ) : (
              <span className='text-muted-foreground'>{String(value)}</span>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className='space-y-2'>
      {title && <h4 className='text-sm font-medium'>{title}</h4>}
      <div className='bg-muted/50 overflow-x-auto rounded-lg p-3 font-mono text-xs'>
        {schema.example ? (
          <pre>{JSON.stringify(schema.example, null, 2)}</pre>
        ) : (
          renderSchema(schema)
        )}
      </div>
    </div>
  );
};

const EndpointCard: React.FC<{
  path: string;
  method: string;
  operation: any;
}> = ({ path, method, operation }) => {
  return (
    <Card className='mb-4'>
      <CardHeader className='pb-3'>
        <div className='flex items-center gap-3'>
          <Badge className={`${methodColors[method.toLowerCase()]} border`}>
            {method.toUpperCase()}
          </Badge>
          <span className='font-mono text-sm'>{path}</span>
        </div>
        <CardTitle className='text-lg'>
          {operation.summary || 'No summary'}
        </CardTitle>
        {operation.description && (
          <CardDescription>{operation.description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className='space-y-6'>
        <ParameterDisplay parameters={operation.parameters} />

        {operation.requestBody && (
          <div className='space-y-3'>
            <h4 className='text-sm font-medium'>Request Body</h4>
            {operation.requestBody.content && (
              <Tabs
                defaultValue={Object.keys(operation.requestBody.content)[0]}
              >
                <TabsList>
                  {Object.keys(operation.requestBody.content).map(
                    (contentType) => (
                      <TabsTrigger key={contentType} value={contentType}>
                        {contentType}
                      </TabsTrigger>
                    )
                  )}
                </TabsList>
                {Object.entries(operation.requestBody.content).map(
                  ([contentType, content]: [string, any]) => (
                    <TabsContent key={contentType} value={contentType}>
                      <SchemaDisplay schema={content.schema} />
                    </TabsContent>
                  )
                )}
              </Tabs>
            )}
          </div>
        )}

        {operation.responses && (
          <div className='space-y-3'>
            <h4 className='text-sm font-medium'>Responses</h4>
            <Accordion type='single' collapsible>
              {Object.entries(operation.responses).map(
                ([statusCode, response]: [string, any]) => (
                  <AccordionItem key={statusCode} value={statusCode}>
                    <AccordionTrigger className='text-left'>
                      <div className='flex items-center gap-2'>
                        <Badge
                          variant={
                            statusCode.startsWith('2')
                              ? 'default'
                              : 'destructive'
                          }
                        >
                          {statusCode}
                        </Badge>
                        <span>{response.description || 'No description'}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      {response.content && (
                        <Tabs defaultValue={Object.keys(response.content)[0]}>
                          <TabsList>
                            {Object.keys(response.content).map(
                              (contentType) => (
                                <TabsTrigger
                                  key={contentType}
                                  value={contentType}
                                >
                                  {contentType}
                                </TabsTrigger>
                              )
                            )}
                          </TabsList>
                          {Object.entries(response.content).map(
                            ([contentType, content]: [string, any]) => (
                              <TabsContent
                                key={contentType}
                                value={contentType}
                              >
                                <SchemaDisplay schema={content.schema} />
                              </TabsContent>
                            )
                          )}
                        </Tabs>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                )
              )}
            </Accordion>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export function OpenAPIViewer({ spec }: OpenAPIViewerProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Group endpoints by tags
  const groupedEndpoints = React.useMemo(() => {
    const groups: Record<
      string,
      Array<{ path: string; method: string; operation: any }>
    > = {};

    Object.entries(spec.paths).forEach(([path, methods]) => {
      Object.entries(methods).forEach(([method, operation]: [string, any]) => {
        if (
          ['get', 'post', 'put', 'patch', 'delete', 'head', 'options'].includes(
            method
          )
        ) {
          const tags = operation.tags || ['Other'];
          tags.forEach((tag: string) => {
            if (!groups[tag]) groups[tag] = [];
            groups[tag].push({ path, method, operation });
          });
        }
      });
    });

    return groups;
  }, [spec.paths]);

  // Filter endpoints based on search
  const filteredGroups = React.useMemo(() => {
    if (!searchTerm) return groupedEndpoints;

    const filtered: typeof groupedEndpoints = {};
    Object.entries(groupedEndpoints).forEach(([tag, endpoints]) => {
      const filteredEndpoints = endpoints.filter(
        ({ path, operation }) =>
          path.toLowerCase().includes(searchTerm.toLowerCase()) ||
          operation.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          operation.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      if (filteredEndpoints.length > 0) {
        filtered[tag] = filteredEndpoints;
      }
    });
    return filtered;
  }, [groupedEndpoints, searchTerm]);

  return (
    <div className='mx-auto max-w-6xl space-y-8 p-6'>
      {/* API Info */}
      <Card>
        <CardHeader>
          <div className='flex items-center gap-2'>
            <Info className='h-5 w-5' />
            <CardTitle>{spec.info.title}</CardTitle>
            <Badge variant='outline'>v{spec.info.version}</Badge>
          </div>
          {spec.info.description && (
            <CardDescription>{spec.info.description}</CardDescription>
          )}
        </CardHeader>
        {spec.servers && spec.servers.length > 0 && (
          <CardContent>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Server className='h-4 w-4' />
                <span className='text-sm font-medium'>Servers</span>
              </div>
              {spec.servers.map((server, index) => (
                <div key={index} className='flex items-center gap-2 text-sm'>
                  <code className='bg-muted rounded px-2 py-1 text-xs'>
                    {server.url}
                  </code>
                  {server.description && (
                    <span className='text-muted-foreground'>
                      - {server.description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Search */}
      <div className='relative'>
        <Search className='text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform' />
        <Input
          placeholder='Search endpoints...'
          value={searchTerm}
          onChange={(e: any) => setSearchTerm(e.target.value)}
          className='pl-10'
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue='endpoints' className='space-y-6'>
        <TabsList>
          <TabsTrigger value='endpoints' className='flex items-center gap-2'>
            <FileText className='h-4 w-4' />
            Endpoints
          </TabsTrigger>
          {spec.components?.schemas && (
            <TabsTrigger value='schemas' className='flex items-center gap-2'>
              <Code className='h-4 w-4' />
              Schemas
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value='endpoints' className='space-y-6'>
          {Object.entries(filteredGroups).map(([tag, endpoints]) => (
            <div key={tag} className='space-y-4'>
              <div className='flex items-center gap-2'>
                <h2 className='text-xl font-semibold'>{tag}</h2>
                <Badge variant='secondary'>{endpoints.length}</Badge>
              </div>
              <Separator />
              <div className='space-y-4'>
                {endpoints.map(({ path, method, operation }, index) => (
                  <EndpointCard
                    key={`${method}-${path}-${index}`}
                    path={path}
                    method={method}
                    operation={operation}
                  />
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        {spec.components?.schemas && (
          <TabsContent value='schemas' className='space-y-6'>
            <div className='space-y-4'>
              <h2 className='text-xl font-semibold'>Schemas</h2>
              <Separator />
              <div className='grid gap-4'>
                {Object.entries(spec.components.schemas).map(
                  ([name, schema]) => (
                    <Card key={name}>
                      <CardHeader>
                        <CardTitle className='text-lg'>{name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <SchemaDisplay schema={schema} />
                      </CardContent>
                    </Card>
                  )
                )}
              </div>
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
