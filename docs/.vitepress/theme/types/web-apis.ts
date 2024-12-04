export const webApiTypes = `
interface Window {
  // Timer functions
  setTimeout(handler: (...args: any[]) => void, timeout: number, ...args: any[]): number;
  clearTimeout(handle: number): void;
  setInterval(handler: (...args: any[]) => void, timeout: number, ...args: any[]): number;
  clearInterval(handle: number): void;
  requestAnimationFrame(callback: FrameRequestCallback): number;
  cancelAnimationFrame(handle: number): void;
  requestIdleCallback(callback: IdleRequestCallback, options?: IdleRequestOptions): number;
  cancelIdleCallback(handle: number): void;

  // Location and History
  location: Location;
  history: History;
  localStorage: Storage;
  sessionStorage: Storage;
  
  // Network and Communication
  fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response>;
  XMLHttpRequest: typeof XMLHttpRequest;
  WebSocket: typeof WebSocket;
  EventSource: typeof EventSource;

  // Workers and Threading
  Worker: typeof Worker;
  SharedWorker: typeof SharedWorker;
  ServiceWorker: typeof ServiceWorker;
  postMessage(message: any, targetOrigin: string, transfer?: Transferable[]): void;

  // Media and Graphics
  Audio: typeof Audio;
  Image: typeof Image;
  ImageData: typeof ImageData;
  createImageBitmap(image: ImageBitmapSource): Promise<ImageBitmap>;
  requestAnimationFrame(callback: FrameRequestCallback): number;

  // Performance and Monitoring
  performance: Performance;
  navigator: Navigator;
  screen: Screen;

  // Security and Permissions
  crypto: Crypto;
  Notification: typeof Notification;
  requestPermission(permission: PermissionName): Promise<PermissionState>;

  // Events and Messaging
  addEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof WindowEventMap>(
    type: K,
    listener: (this: Window, ev: WindowEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  dispatchEvent(event: Event): boolean;

  // Storage and Caching
  caches: CacheStorage;
  indexedDB: IDBFactory;

  // Device APIs
  matchMedia(query: string): MediaQueryList;
  devicePixelRatio: number;
  innerWidth: number;
  innerHeight: number;

  // Geolocation
  navigator: {
    geolocation: {
      getCurrentPosition(
        successCallback: PositionCallback,
        errorCallback?: PositionErrorCallback,
        options?: PositionOptions
      ): void;
      watchPosition(
        successCallback: PositionCallback,
        errorCallback?: PositionErrorCallback,
        options?: PositionOptions
      ): number;
      clearWatch(watchId: number): void;
    };
  };

  // WebRTC
  RTCPeerConnection: typeof RTCPeerConnection;
  RTCSessionDescription: typeof RTCSessionDescription;
  RTCIceCandidate: typeof RTCIceCandidate;
  MediaStream: typeof MediaStream;
  MediaStreamTrack: typeof MediaStreamTrack;

  // WebGL
  WebGLRenderingContext: typeof WebGLRenderingContext;
  WebGL2RenderingContext: typeof WebGL2RenderingContext;

  // Web Components
  customElements: CustomElementRegistry;
  ShadowRoot: typeof ShadowRoot;

  // Clipboard
  clipboard: {
    readText(): Promise<string>;
    writeText(text: string): Promise<void>;
    read(): Promise<ClipboardItems>;
    write(items: ClipboardItems): Promise<void>;
  };

  // Web Authentication
  PublicKeyCredential: typeof PublicKeyCredential;
  CredentialsContainer: typeof CredentialsContainer;

  // Web Bluetooth
  bluetooth: {
    requestDevice(options?: RequestDeviceOptions): Promise<BluetoothDevice>;
    getAvailability(): Promise<boolean>;
  };

  // Web USB
  USB: {
    requestDevice(options: USBDeviceRequestOptions): Promise<USBDevice>;
    getDevices(): Promise<USBDevice[]>;
  };

  // Web Serial
  serial: {
    requestPort(options?: SerialPortRequestOptions): Promise<SerialPort>;
    getPorts(): Promise<SerialPort[]>;
  };

  // Web MIDI
  requestMIDIAccess(options?: WebMidi.MIDIOptions): Promise<WebMidi.MIDIAccess>;

  // Web Audio
  AudioContext: typeof AudioContext;
  AudioWorkletNode: typeof AudioWorkletNode;
  OscillatorNode: typeof OscillatorNode;
  AudioBuffer: typeof AudioBuffer;

  // Web Speech
  SpeechSynthesis: typeof SpeechSynthesis;
  SpeechRecognition: typeof SpeechRecognition;

  // Web Share
  share(data?: ShareData): Promise<void>;
  canShare(data?: ShareData): boolean;

  // Web Payments
  PaymentRequest: typeof PaymentRequest;
  PaymentResponse: typeof PaymentResponse;

  // Web Locks
  navigator: {
    locks: {
      request(name: string, callback: (lock: Lock) => Promise<any>): Promise<any>;
      query(): Promise<LockManagerSnapshot>;
    };
  };

  // Web Background Sync
  SyncManager: {
    register(tag: string): Promise<void>;
    getTags(): Promise<string[]>;
  };

  // Web Periodic Background Sync
  PeriodicSyncManager: {
    register(tag: string, options?: PeriodicSyncOptions): Promise<void>;
    unregister(tag: string): Promise<void>;
    getTags(): Promise<string[]>;
  };

  // Web Push
  PushManager: {
    subscribe(options?: PushSubscriptionOptionsInit): Promise<PushSubscription>;
    getSubscription(): Promise<PushSubscription | null>;
    permissionState(options?: PushSubscriptionOptionsInit): Promise<PermissionState>;
  };

  // Presentation API
  PresentationRequest: typeof PresentationRequest;
  PresentationConnection: typeof PresentationConnection;

  // Screen Wake Lock
  WakeLock: {
    request(type: 'screen'): Promise<WakeLockSentinel>;
  };

  // Web NFC
  NDEFReader: {
    scan(): Promise<void>;
    write(message: NDEFMessage): Promise<void>;
  };

  // Web HID
  HID: {
    requestDevice(options: HIDDeviceRequestOptions): Promise<HIDDevice[]>;
    getDevices(): Promise<HIDDevice[]>;
  };

  // Content Index
  ContentIndex: {
    add(description: ContentDescription): Promise<void>;
    delete(id: string): Promise<void>;
    getAll(): Promise<ContentDescription[]>;
  };

  // Web Transport
  WebTransport: typeof WebTransport;
  
  // File System Access
  showOpenFilePicker(options?: OpenFilePickerOptions): Promise<FileSystemFileHandle[]>;
  showSaveFilePicker(options?: SaveFilePickerOptions): Promise<FileSystemFileHandle>;
  showDirectoryPicker(options?: DirectoryPickerOptions): Promise<FileSystemDirectoryHandle>;
}

// Additional global interfaces
interface IdleRequestCallback {
  (deadline: IdleDeadline): void;
}

interface IdleDeadline {
  readonly didTimeout: boolean;
  timeRemaining(): DOMHighResTimeStamp;
}

interface IdleRequestOptions {
  timeout?: number;
}

interface FrameRequestCallback {
  (time: DOMHighResTimeStamp): void;
}

interface PermissionDescriptor {
  name: PermissionName;
}

type PermissionName =
  | 'geolocation'
  | 'notifications'
  | 'push'
  | 'midi'
  | 'camera'
  | 'microphone'
  | 'speaker'
  | 'device-info'
  | 'background-fetch'
  | 'background-sync'
  | 'bluetooth'
  | 'persistent-storage'
  | 'ambient-light-sensor'
  | 'accelerometer'
  | 'gyroscope'
  | 'magnetometer'
  | 'clipboard-read'
  | 'clipboard-write'
  | 'payment-handler'
  | 'idle-detection'
  | 'periodic-background-sync'
  | 'system-wake-lock'
  | 'nfc';

type PermissionState = 'granted' | 'denied' | 'prompt';

interface ShareData {
  title?: string;
  text?: string;
  url?: string;
  files?: File[];
}

interface Lock {
  name: string;
  mode: 'shared' | 'exclusive';
}

interface LockManagerSnapshot {
  held: Lock[];
  pending: Lock[];
}

interface PeriodicSyncOptions {
  minInterval: number;
}

interface ContentDescription {
  id: string;
  title: string;
  description?: string;
  category: 'homepage' | 'article' | 'video' | 'audio';
  icons?: ImageResource[];
  url: string;
}

interface ImageResource {
  src: string;
  sizes?: string;
  type?: string;
}
`;
