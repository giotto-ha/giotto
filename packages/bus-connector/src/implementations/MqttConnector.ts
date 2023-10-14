import {connect, type MqttClient} from 'mqtt';
import { BusConnector, BusMessage } from '../BusConnector.js';

export class MqttConnector implements BusConnector {
  private client: MqttClient;
  private listeners: Map<string, Array<(message: BusMessage) => void>> = new Map();

  constructor({url}:{url?: string}) {
    const mqttUrl = url ?? process.env['MQTT_URL']??'';
    this.client = connect(mqttUrl);
  }
    listenTo(topic: string, callback: (message: BusMessage) => void){
        if(!this.listeners.has(topic)){
            this.client.subscribe(topic);
            this.listeners.set(topic, []);
        }
        this.listeners.get(topic)?.push(callback);
    };

    stopListeningTo(topic: string) {
        this.client.unsubscribe(topic);
        this.listeners.delete(topic);
    };

    sendMessage (topic: string, message: BusMessage){
        this.client.publish(topic, JSON.stringify(message));
    }
}