# Things

A Thing is something that interacts with its environment. Examples include thermometers, light switches and dimmers, blinds motors, etc.

At a very high level, Things do one or more of these actions:

 - Report environmental state (EState)
 - Report self-state (SState)
 - Modify the environment.


## Reporting environmental state

From a Thing's perspective, the world is split between itself and the environment. 

Things, such as sensors, can report on the state of the environment. Such state could be:

 - Temperature
 - Humidity
 - Presence of moisture
 - Motion

State can be reported in a variety of ways

 - Some numeric value (eg temperature)
   - percentage 
   - date/time
 - One of two binary states (eg wet/dry)
 - One of an set of states (eg weather conditions)


## Reporting self-state

Some Things have their own internal state that can be modified. A prime example is a switch. A switch can be on or off (binary) or may have some dimmer level (numeric).
These can generally be modified via software, but often via some physical means. As such, this state needs to be reported by the Thing whenever it changes.

Self-state can take all the forms of environmental state.

## Modifying the environment

Some Things can modify the environment. This occurs through modifications to the Thing itself, such as switching on or off or setting a target temperature.

Modifications to the environment are generally brought about by sending a requested target state to the Thing. Usually, this will result in some modification of self-state and subsequent changes to environmental state.


# Example Things

Here are a few example Things and their capabilities.

| Thing | Report SState | Report EState | Modify Environment |
|:---| :---: | :---: | :---: |
| Thermometer |  | ✅ | |
| Light Switch | ✅ | | ✅ |
| Heater | ✅ | ✅ | ✅ |
