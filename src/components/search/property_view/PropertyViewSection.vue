<template>
  <div v-if="sectionData" id="propertyViewSection">
    <template v-if="sectionParams">
      <h2>{{ sectionParams.title }}</h2>
    </template>
    <v-data-table
      :headers="tableHeaders"
      :items="sectionData"
      item
      hide-actions
    >
      <template v-slot:items="props">
        <td
          v-if="props.item.value && typeof props.item.value === 'object'"
          id="tabularData"
          colspan="2"
        >
          <h5 class="text-xs-left">
            Schools
          </h5>
          <div class="property-view-section__sub-table">
            <v-data-table
              :headers="props.item.value.tableHeaders"
              :items="props.item.value.tableValues"
              item
              hide-actions
            >
              <template v-slot:items="tableProps">
                <td v-for="i in 3" :key="i" class="text-xs-left">
                  {{ getPropertyValue(tableProps.item[i]) }}
                </td>
              </template>
            </v-data-table>
          </div>
        </td>
        <template v-else>
          <td id="propertyViewFirstCol" class="text-xs-left">
            {{ props.item.text }}
          </td>
          <td v-if="props.item.key" class="text-xs-left">
            {{ getPropertyValue(props.item.key) }}
          </td>
          <td v-else-if="typeof props.item.value === 'string'" class="text-xs-left">
            {{ props.item.value }}
          </td>
        </template>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  props: {
    sectionData: {
      required: true,
      validator: prop => typeof prop === 'object' || prop === null
    },
    sectionParams: {
      type: Object,
      default: () => {
        return {}
      }
    },
    propertyDetails: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      tableHeaders: [
        { text: '', value: '', sortable: false, width: '40%' },
        { text: '', value: '', sortable: false, width: '60%' }
      ]
    }
  },

  methods: {
    getPropertyValue(columnParam) {
      return this.propertyDetails[columnParam]
    }
  }

}
</script>

<style>
#propertyViewSection h2 {
  font-weight: 300;
  text-align: left;
}

#propertyViewSection .v-datatable thead tr {
  height: 1px !important;
}

#tabularData {
  padding-top: 17px;
  padding-left: 2rem !important;
}

#tabularData h5 {
  font-weight: 600;
  font-size: 13px;
}

#propertyViewFirstCol {
  font-weight: 600 !important;
  padding-left: 2rem !important;
}

</style>
