export const grpcApiTypes = `
// gRPC Core Types
interface GrpcService {
  [methodName: string]: GrpcMethod;
}

interface GrpcMethod {
  path: string;
  requestStream: boolean;
  responseStream: boolean;
  requestSerialize: (value: any) => Buffer;
  requestDeserialize: (value: Buffer) => any;
  responseSerialize: (value: any) => Buffer;
  responseDeserialize: (value: Buffer) => any;
}

interface GrpcObject {
  [serviceName: string]: GrpcService | GrpcObject;
}

// gRPC Client Types
interface GrpcClient {
  close(): void;
  waitForReady(deadline: Deadline, callback: (error?: Error) => void): void;
  getChannel(): Channel;
}

interface UnaryCallback<ResponseType> {
  (error: ServiceError | null, response?: ResponseType): void;
}

interface ClientUnaryCall {
  cancel(): void;
  getPeer(): string;
}

interface ClientReadableStream<ResponseType> extends NodeJS.ReadableStream {
  cancel(): void;
  getPeer(): string;
  on(event: 'data', listener: (response: ResponseType) => void): this;
  on(event: 'end', listener: () => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'status', listener: (status: StatusObject) => void): this;
}

interface ClientWritableStream<RequestType> extends NodeJS.WritableStream {
  cancel(): void;
  getPeer(): string;
  end(callback?: () => void): void;
  write(message: RequestType, callback?: (error: Error | null) => void): boolean;
}

interface ClientDuplexStream<RequestType, ResponseType> extends NodeJS.ReadWriteStream {
  cancel(): void;
  getPeer(): string;
  end(callback?: () => void): void;
  write(message: RequestType, callback?: (error: Error | null) => void): boolean;
  on(event: 'data', listener: (response: ResponseType) => void): this;
  on(event: 'end', listener: () => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'status', listener: (status: StatusObject) => void): this;
}

// gRPC Server Types
interface Server {
  addService(service: ServiceDefinition, implementation: any): void;
  bind(port: string, credentials: ServerCredentials): void;
  start(): void;
  tryShutdown(callback: () => void): void;
  forceShutdown(): void;
}

interface ServiceDefinition {
  [methodName: string]: MethodDefinition<any, any>;
}

interface MethodDefinition<RequestType, ResponseType> {
  path: string;
  requestStream: boolean;
  responseStream: boolean;
  requestSerialize: (value: RequestType) => Buffer;
  requestDeserialize: (value: Buffer) => RequestType;
  responseSerialize: (value: ResponseType) => Buffer;
  responseDeserialize: (value: Buffer) => ResponseType;
}

// gRPC Metadata Types
interface Metadata {
  get(key: string): string[];
  getMap(): { [key: string]: string };
  set(key: string, value: string | Buffer): void;
  remove(key: string): void;
  clone(): Metadata;
}

// gRPC Status Types
interface StatusObject {
  code: Status;
  details: string;
  metadata: Metadata;
}

enum Status {
  OK = 0,
  CANCELLED = 1,
  UNKNOWN = 2,
  INVALID_ARGUMENT = 3,
  DEADLINE_EXCEEDED = 4,
  NOT_FOUND = 5,
  ALREADY_EXISTS = 6,
  PERMISSION_DENIED = 7,
  RESOURCE_EXHAUSTED = 8,
  FAILED_PRECONDITION = 9,
  ABORTED = 10,
  OUT_OF_RANGE = 11,
  UNIMPLEMENTED = 12,
  INTERNAL = 13,
  UNAVAILABLE = 14,
  DATA_LOSS = 15,
  UNAUTHENTICATED = 16,
}

// gRPC Error Types
interface ServiceError extends Error {
  code: Status;
  metadata: Metadata;
  details: string;
}

// gRPC Channel Types
interface Channel {
  getTarget(): string;
  getConnectivityState(tryToConnect: boolean): ConnectivityState;
  watchConnectivityState(
    currentState: ConnectivityState,
    deadline: Deadline,
    callback: (error?: Error) => void
  ): void;
  close(): void;
}

enum ConnectivityState {
  IDLE = 0,
  CONNECTING = 1,
  READY = 2,
  TRANSIENT_FAILURE = 3,
  SHUTDOWN = 4,
}

// gRPC Credentials Types
interface ChannelCredentials {
  compose(callCredentials: CallCredentials): ChannelCredentials;
}

interface CallCredentials {
  compose(callCredentials: CallCredentials): CallCredentials;
}

interface ServerCredentials {
  createInsecure(): ServerCredentials;
  createSsl(
    rootCerts: Buffer | null,
    keyCertPairs: KeyCertPair[] | null,
    checkClientCertificate?: boolean
  ): ServerCredentials;
}

interface KeyCertPair {
  privateKey: Buffer;
  certChain: Buffer;
}

// gRPC Call Options
interface CallOptions {
  deadline?: Deadline;
  host?: string;
  parent?: ServerUnaryCall<any, any> | ServerReadableStream<any, any>;
  propagate_flags?: number;
  credentials?: CallCredentials;
  interceptors?: Interceptor[];
  interceptor_providers?: InterceptorProvider[];
}

// gRPC Interceptor Types
interface Interceptor {
  intercept<RequestType, ResponseType>(
    options: InterceptorOptions,
    nextCall: (options: CallOptions) => InterceptorReturnType<RequestType, ResponseType>
  ): InterceptorReturnType<RequestType, ResponseType>;
}

interface InterceptorOptions extends CallOptions {
  method_definition: MethodDefinition<any, any>;
  request_header: Metadata;
}

type InterceptorReturnType<RequestType, ResponseType> =
  | ClientUnaryCall
  | ClientReadableStream<ResponseType>
  | ClientWritableStream<RequestType>
  | ClientDuplexStream<RequestType, ResponseType>;

interface InterceptorProvider {
  (method_definition: MethodDefinition<any, any>, call_options: CallOptions): Interceptor;
}

// gRPC Server Call Types
interface ServerUnaryCall<RequestType, ResponseType> {
  request: RequestType;
  metadata: Metadata;
  getPeer(): string;
  sendMetadata(responseMetadata: Metadata): void;
}

interface ServerReadableStream<RequestType, ResponseType> extends NodeJS.ReadableStream {
  metadata: Metadata;
  getPeer(): string;
  sendMetadata(responseMetadata: Metadata): void;
}

interface ServerWritableStream<RequestType, ResponseType> extends NodeJS.WritableStream {
  request: RequestType;
  metadata: Metadata;
  getPeer(): string;
  sendMetadata(responseMetadata: Metadata): void;
}

interface ServerDuplexStream<RequestType, ResponseType> extends NodeJS.ReadWriteStream {
  metadata: Metadata;
  getPeer(): string;
  sendMetadata(responseMetadata: Metadata): void;
}

// gRPC Protobuf Types
interface ProtobufTypeDefinition {
  format: string;
  type: any;
  fileDescriptorProtos: Buffer[];
}

interface PackageDefinition {
  [serviceName: string]: GrpcObject;
}

// gRPC Load Package Types
interface GrpcLoadPackageDefinition {
  (packageDef: PackageDefinition): GrpcObject;
}

// gRPC Deadline Types
type Deadline = Date | number;

// gRPC Message Types
interface Message {
  toObject(): { [key: string]: any };
  toJSON(): { [key: string]: any };
  serialize(): Buffer;
  [field: string]: any;
}

// gRPC Service Implementation Types
interface ServiceImplementation {
  [methodName: string]: HandleCall<any, any>;
}

type HandleCall<RequestType, ResponseType> =
  | handleUnaryCall<RequestType, ResponseType>
  | handleClientStreamingCall<RequestType, ResponseType>
  | handleServerStreamingCall<RequestType, ResponseType>
  | handleBidiStreamingCall<RequestType, ResponseType>;

type handleUnaryCall<RequestType, ResponseType> = (
  call: ServerUnaryCall<RequestType, ResponseType>,
  callback: sendUnaryData<ResponseType>
) => void;

type handleClientStreamingCall<RequestType, ResponseType> = (
  call: ServerReadableStream<RequestType, ResponseType>,
  callback: sendUnaryData<ResponseType>
) => void;

type handleServerStreamingCall<RequestType, ResponseType> = (
  call: ServerWritableStream<RequestType, ResponseType>
) => void;

type handleBidiStreamingCall<RequestType, ResponseType> = (
  call: ServerDuplexStream<RequestType, ResponseType>
) => void;

type sendUnaryData<ResponseType> = (
  error: ServiceError | null,
  value?: ResponseType,
  trailer?: Metadata,
  flags?: number
) => void;
`;
