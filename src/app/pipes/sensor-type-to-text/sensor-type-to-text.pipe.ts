import { Pipe, PipeTransform } from '@angular/core';
import { SensorType } from 'src/app/model/sensor-type.enum';

const SensorTypes = {};
SensorTypes[SensorType.SENSOR_SIMULATED] = 'Simulation';
SensorTypes[SensorType.SENSOR_ANALOG_TEST] = 'Analog Test';
SensorTypes[SensorType.SENSOR_DS18B20] = 'DS18B20 Temperature';
SensorTypes[SensorType.SENSOR_GUT800] = 'GUT800 Depth';
SensorTypes[SensorType.SENSOR_INA260_VOLTAGE] = 'INA260 Voltage';
SensorTypes[SensorType.SENSOR_INA260_CURRENT] = 'INA260 Current';
SensorTypes[SensorType.SENSOR_INA260_POWER] = 'INA260 Power';
SensorTypes[SensorType.SENSOR_COMBINED] = 'Combined';

@Pipe({
  name: 'sensorTypeToText'
})
export class SensorTypeToTextPipe implements PipeTransform {
  transform(sensorType: SensorType): string {
    return SensorTypes[sensorType] || 'Unknown';
  }
}
