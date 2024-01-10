<script lang="ts" setup>

import MapTileSelectionBtn from "@/components/editor/MapTileSelectionBtn.vue";
import {TileType} from "@/api/generated";
import FrogPlacementButton from "@/components/editor/FrogPlacementButton.vue";
import FoodPlacementButton from "@/components/editor/FoodPlacementButton.vue";
</script>

<template>
  <v-card>
    <v-card-title>Editor Options</v-card-title>
    <v-card-text>
      <v-row>
        <MapTileSelectionBtn :type="TileType.Wall" hotkey="1"/>
        <MapTileSelectionBtn :type="TileType.Floor" hotkey="2"/>
        <MapTileSelectionBtn :type="TileType.Void" hotkey="3"/>
        <FrogPlacementButton hotkey="4"/>
        <FoodPlacementButton hotkey="5"/>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>