<template>
  <v-dialog
    v-model="openModal"
    :width="modal.xlarge_width"
    :max-width="modal.xlarge_maxWidth"
    persistent
  >
    <v-card v-if="selectedHome" class="feedback-modal__card">
      <v-icon class="feedback-modal__close" @click.stop="closeFeedbackModal()">
        close
      </v-icon>
      <template v-if="wantNeedData.needs || wantNeedData.wants">
        <div class="feedback-modal__title text-center">
          <div>{{ clientData.name }}</div>
          <div>{{ getHomeFullAddress() }}</div>
          <div
            v-if="!isClientEdited()"
            class="feedback-modal__ribbon feedback-modal__top-left-marker"
          >
            <span>Filled/Edited by Agent</span>
          </div>
        </div>
        <v-layout wrap>
          <v-flex xs12 md9 class="px-3 feedback-modal__review-container">
            <v-layout wrap>
              <v-flex xs6>
                <div class="feedback-modal__progress">
                  <v-progress-circular
                    :size="80"
                    :width="15"
                    :value="getPrefPercent('Want')"
                    :color="wantNeedData.wantsMatch > 0 ? '#4da449' : '#b8b8b8'"
                  />
                  <div
                    :style="{'color': wantNeedData.wantsMatch > 0 ? '#4da449' : '#b8b8b8'}"
                    class="feedback-modal__percent"
                  >
                    Wants&nbsp;
                    <div style="font-size: 3rem;">
                      {{ getPrefPercent('Want') }}%
                    </div>
                  </div>
                </div>
              </v-flex>
              <v-flex xs6>
                <div class="feedback-modal__progress">
                  <v-progress-circular
                    :size="80"
                    :width="15"
                    :value="getPrefPercent('Need')"
                    :color="wantNeedData.needsMatch > 0 ? '#b34f92' : '#b8b8b8'"
                  />
                  <div
                    :style="{'color': wantNeedData.needsMatch > 0 ? '#b34f92' : '#b8b8b8'}"
                    class="feedback-modal__percent"
                  >
                    Needs&nbsp;
                    <div style="font-size: 2em;">
                      {{ getPrefPercent('Need') }}%
                    </div>
                  </div>
                </div>
              </v-flex>
            </v-layout>
            <!-- displaying in the form of chips -->
            <v-layout wrap class="mt-md-3">
              <v-flex v-if="wantNeedData.wants" xs6 class="pr-2">
                <div class="feedback-modal__chips-container">
                  <h4>Wants match</h4>
                  <v-chip
                    v-for="want in wantNeedData.wants"
                    :key="want.name"
                    class="feedback-modal__chips"
                    :style="{'background-color' : want.match ? '#4da449' : '#b8b8b8'}"
                    disabled
                    @click="wantFulfill(want)"
                  >
                    {{ want.name }}
                  </v-chip>
                </div>
              </v-flex>
              <v-flex v-if="wantNeedData.needs" xs6 class="pl-2">
                <div class="feedback-modal__chips-container">
                  <h4>Needs match</h4>
                  <v-chip
                    v-for="need in wantNeedData.needs"
                    :key="need.name"
                    class="feedback-modal__chips"
                    :style="{'background-color' : need.match ? '#b34f92' : '#b8b8b8'}"
                    disabled
                    @click="needFulfill(need)"
                  >
                    {{ need.name }}
                  </v-chip>
                </div>
              </v-flex>
            </v-layout>
            <!-- Notes container -->
            <div class="feedback-modal__notes--container">
              <div class="feedback-modal__notes--inner notes-scroll">
                <div class="feedback-modal__notes--title">
                  Notes:
                </div>
                <template v-if="notesList.length > 0">
                  <div
                    v-for="(note, index) in notesList"
                    :key="index"
                    class="feedback-modal__notes--single-note"
                  >
                    <span style="font-weight: 600;">{{ getPersonName(note) || personName }}   : </span>
                    <span class="note--text">{{ note._timestamp | dateFormat }} - {{ note.text }}</span>
                    <div v-if="isSelfNote(note._creator)">
                      <v-icon small @click="editSelectedNote(index)">
                        edit
                      </v-icon>
                      <v-icon small @click="removeSelectedNote(index)">
                        close
                      </v-icon>
                    </div>
                  </div>
                </template>
                <div v-else>
                  No notes entered yet
                </div>
              </div>
            </div>
            <!-- Input for entering new feedback (layout only) -->
          </v-flex>
          <v-flex xs12 md3 class="feedback-modal__image-container">
            <image-uploader v-model="uploader">
              <template v-slot:activator>
                <button class="feedback-modal__button">
                  Upload Picture
                </button>
              </template>
            </image-uploader>
            <!-- <input ref="uploadImage" type="file" name="uploadImage" class="feedback-modal__button" value="Upload Picture"> -->
            <div class="feedback-modal__image" style="overflow-y: scroll; height: 300px" >
              <template v-if="uploadedImages.length > 0">
                <div v-for="(imageObj, index) in uploadedImages" :key="index">
                  <v-hover>
                    <div v-if="imageObj.imageURL" slot-scope="{hover}" class="feedback-modal__image-placeholder">
                      <ImageGrid :srcarr="imageObj.imageURL?[imageObj.imageURL]:[]" />
                      <v-fade-transition>
                        <v-layout v-if="hover" class="image-hover white--text">
                          <v-flex xs12>
                            <v-icon color="#fff" class="hover-icon" title="delete" @click.stop="onRemoveImageClicked(index)">
                              fas fa-trash-alt
                            </v-icon>
                          </v-flex>
                        </v-layout>
                      </v-fade-transition>
                    </div>
                    <div v-else />
                  </v-hover>
                </div>
              </template>
              <div v-else class="feedback-modal__image-placeholder">
                <v-icon color="#bebebe">
                  add_photo_alternate
                </v-icon>
                <div>No Images</div>
              </div>
            </div>
          </v-flex>
        </v-layout>
      </template>
      <v-layout>
        <v-flex xs12 md9>
          <v-layout wrap class="feedback-modal__input">
            <v-flex xs12 sm8 class="px-2">
              <input
                id="newFeedback"
                ref="enteredNote"
                v-model="enteredNote"
                type="text"
                name="newFeedback"
                @keyup.enter="addFeedbackNote(enteredNote)"
              >
            </v-flex>
            <v-flex xs12 sm4 class="px-2">
              <button
                class="feedback-modal__button"
                @click="addFeedbackNote(enteredNote)"
              >
                Add Note
              </button>
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex xs12 md3>
          <loader-button
            :btn-settings="{outline: true, round: true, color: '#289A95'}"
            :btn-text="'Confirm'"
            :btn-class="'feedback-modal-button'"
            :loading="saveInProgress"
            :disabled="saveInProgress"
            @handle-button-click="saveFeedbackData()"
          />
        </v-flex>
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script>
import moment from 'moment'
import ImageGrid from '../client-detail/Components/ImageGrid'
import { mapState, mapGetters } from 'vuex'
import { isEmpty } from '../../utils/generalUtils'
import {
  genericPutRequestToApi,
  genericPostRequestToApi,
  genericDeleteRequestToApi
} from '../../utils/genericRequests'
import {
  UpdateFeedbackMatchUrl,
  UpdateFeedbackNotesUrl,
  CreateUpdateFeedbackMediaUrl,
  DeleteFeedbackMediaUrl
} from '../../utils/clientUrls'
import refreshClientData from '../mixins/refreshClientData'
import refreshContent from '../mixins/refreshContent'
import ImageUploader from '../uiUtils/ImageUploader.vue'
import LoaderButton from '../uiUtils/LoaderButton.vue'
import { propertyFullAddress } from '../../utils/propertyUtils'

const defaultWantNeed = {
  wants: null,
  wantsMatch: 0,
  needs: null,
  needsMatch: 0
}

export default {
  components: { ImageUploader, LoaderButton, ImageGrid },

  filters: {
    dateFormat: value => {
      return moment(value).format('MM-DD-YY hh:mma')
    }
  },

  mixins: [refreshContent, refreshClientData],

  props: {
    openModal: {
      type: Boolean,
      default: false
    },
    selectedHome: {
      required: true,
      validator: prop => typeof prop === 'object' || prop === null
    },
    personName: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      wantNeedData: defaultWantNeed,
      enteredNote: '',
      notesList: [],
      editNotePosition: -1,
      uploader: null,
      uploadedImages: [],
      selectedIndices: [],
      totalImages: 0,
      saveInProgress: false
    }
  },

  computed: {
    ...mapState('client', ['clientFavorites', 'associatedAgent']),
    ...mapState('agent', ['agentData']),
    ...mapState('common', ['profileStatus']),
    ...mapState('style', ['modal']),
    ...mapGetters('client', ['clientPreferences'])
  },

  watch: {
    uploader: {
      handler: function(newValue, oldValue) {
        if (!isEmpty(newValue)) {
          if (!isEmpty(oldValue)) {
            if (newValue.imageURL !== oldValue.imageURL) {
              this.uploadedImages.unshift(newValue)
            }
          } else {
            this.uploadedImages.unshift(newValue)
          }
        }
      },
      deep: true
    }
  },

  created() {
    this.setFeedbackWantNeed()
  },

  methods: {
    isClientEdited() {
      if (
        !isEmpty(this.selectedHome.feedback) &&
        this.selectedHome.feedback.match
      ) {
        return (
          this.selectedHome.feedback.match._creator === this.clientData._id
        )
      }
      return true
    },

    closeFeedbackModal() {
      this.$emit('close-feedback-modal')
    },

    onRemoveImageClicked(imageIndex) {
      let deleteIndex = -1
      for (let i = 0; i <= imageIndex; i++) {
        if (!('imageFile' in this.uploadedImages[i])) {
          deleteIndex += 1
        }
      }

      this.uploadedImages[imageIndex].imageURL = null

      if (deleteIndex >= 0 && !this.selectedIndices.includes(deleteIndex)) {
        this.selectedIndices.push(deleteIndex)
        // genericDeleteRequestToApi(DeleteFeedbackMediaUrl(this.clientData._id, this.selectedHome._id, this.totalImages - deleteIndex - 1))
        // .then(response => {
        //   if (response.status === 200) {
        //     if (response.feedback.media) {
        //       response.feedback.media.forEach(image => {
        //         this.uploadedImages.unshift({
        //           imageURL: image
        //         })
        //       })
        //     }
        //   }
        // })
      }
    },

    async saveFeedbackData() {
      this.saveInProgress = true
      let imageFormData = new FormData()
      this.uploadedImages.filter(image => image.imageURL !== null)
      for (let i = 0; i < this.uploadedImages.length; i++) {
        imageFormData.append('upload', this.uploadedImages[i].imageFile)
      }

      const resultNeedWant = {
        results: [...this.wantNeedData.wants, ...this.wantNeedData.needs]
      }

      // We can always send this, as there are too many values to check otherwise
      await genericPutRequestToApi(
        UpdateFeedbackMatchUrl(this.clientData._id, this.selectedHome._id),
        resultNeedWant
      )

      // Check to update the notes
      if (!isEmpty(this.notesList)) {
        const resultNotes = { notes: this.notesList }
        await genericPutRequestToApi(
          UpdateFeedbackNotesUrl(this.clientData._id, this.selectedHome._id),
          resultNotes
        )
      }

      // Check to update the images
      if (!isEmpty(this.uploadedImages)) {
        await genericPostRequestToApi(
          CreateUpdateFeedbackMediaUrl(
            this.clientData._id,
            this.selectedHome._id
          ),
          imageFormData
        )
        if (!isEmpty(this.selectedIndices)) {
          this.deleteImages()
        } else {
          this.refreshData()
        }
      } else {
        this.refreshData()
      }
    },

    async deleteImages() {
      for (const deleteIndex of this.selectedIndices) {
        await genericDeleteRequestToApi(DeleteFeedbackMediaUrl(this.clientData._id, this.selectedHome._id, this.totalImages - deleteIndex - 1))
      }
      this.refreshData()
    },

    refreshData() {
      if (this.profileStatus === 'agent') this.getAgentData()
      else this.getClientData()
      this.saveInProgress = false
      this.closeFeedbackModal()
    },

    setFeedbackWantNeed() {
      let preferenceList = []
      if (this.clientData && this.clientData.homePrefs) {
        if (this.selectedHome && this.selectedHome.feedback) {
          const preferenceObject = this.clientData.homePrefs.options.map(
            pref => {
              preferenceList.push(pref.text)
              return {
                match: false,
                name: pref.text,
                wantNeed: pref.wantNeed
              }
            }
          )
          if (this.selectedHome.feedback.match) {
            const feedbackWantNeedList = this.selectedHome.feedback.match
              .results
            let wantsMatch = 0
            let needsMatch = 0
            feedbackWantNeedList.map(pref => {
              if (preferenceList.includes(pref.name)) {
                if (pref.match) {
                  pref.wantNeed === 'Want' ? wantsMatch++ : needsMatch++

                  const prefIndex = preferenceList.indexOf(pref.name)
                  preferenceObject[prefIndex].match = true
                }
              }
            })
            Object.assign(this.wantNeedData, {
              wants: preferenceObject.filter(pref => pref.wantNeed === 'Want'),
              wantsMatch,
              needs: preferenceObject.filter(pref => pref.wantNeed === 'Need'),
              needsMatch
            })
          } else {
            this.wantNeedData = Object.assign(
              {},
              {
                wants: this.clientPreferences('Want'),
                wantsMatch: 0,
                needs: this.clientPreferences('Need'),
                needsMatch: 0
              }
            )
          }
          if (this.selectedHome.feedback.notes) {
            this.notesList = JSON.parse(
              JSON.stringify(this.selectedHome.feedback.notes)
            )
          } else {
            this.notesList = []
          }

          if (this.selectedHome.feedback.media) {
            this.selectedHome.feedback.media.forEach(image => {
              this.uploadedImages.unshift({
                imageURL: image
              })
            })
            this.totalImages = this.selectedHome.feedback.media.length
          }
        }
      }
    },

    wantFulfill(selectedWant) {
      let wantsArray = this.wantNeedData.wants
      let wantIndex = wantsArray.findIndex(
        want => want.name === selectedWant.name
      )
      wantsArray.splice(wantIndex, 1)
      wantsArray.splice(wantIndex, 0, {
        match: !selectedWant.match,
        name: selectedWant.name,
        wantNeed: 'Want'
      })
      Object.assign(this.wantNeedData, {
        wants: wantsArray
      })
      selectedWant.match
        ? Object.assign(this.wantNeedData, {
          wantsMatch: this.wantNeedData.wantsMatch - 1
        })
        : Object.assign(this.wantNeedData, {
          wantsMatch: this.wantNeedData.wantsMatch + 1
        })
    },

    needFulfill(selectedNeed) {
      let needsArray = this.wantNeedData.needs
      let needIndex = needsArray.findIndex(
        need => need.name === selectedNeed.name
      )
      needsArray.splice(needIndex, 1)
      needsArray.splice(needIndex, 0, {
        match: !selectedNeed.match,
        name: selectedNeed.name,
        wantNeed: 'Need'
      })
      Object.assign(this.wantNeedData, {
        needs: needsArray
      })
      selectedNeed.match
        ? Object.assign(this.wantNeedData, {
          needsMatch: this.wantNeedData.needsMatch - 1
        })
        : Object.assign(this.wantNeedData, {
          needsMatch: this.wantNeedData.needsMatch + 1
        })
    },

    isSelfNote(noteCreatorId) {
      if (this.profileStatus === 'agent') {
        return noteCreatorId === this.agentData._id || this.personName
      } else {
        return noteCreatorId === this.clientData._id || this.personName
      }
    },

    getPersonName(note) {
      if (note && note._creator) {
        if (note._creator === this.clientData._id) {
          return this.clientData.name
        } else {
          if (this.profileStatus === 'agent') {
            return this.agentData ? this.agentData.name : ''
          } else {
            return this.associatedAgent ? this.associatedAgent.name : ''
          }
        }
      }
    },

    getPrefPercent(preference) {
      if (preference === 'Need') {
        return Math.round(
          (this.wantNeedData.needsMatch / this.wantNeedData.needs.length) * 100
        ).toString()
      } else {
        return Math.round(
          (this.wantNeedData.wantsMatch / this.wantNeedData.wants.length) * 100
        ).toString()
      }
    },

    addFeedbackNote(text) {
      if (text.length > 0) {
        if (this.editNotePosition >= 0) {
          this.notesList[this.editNotePosition].text = text
          this.editNotePosition = -1
        } else {
          this.notesList.push({ text })
        }
        this.enteredNote = ''
      }
    },

    editSelectedNote(position) {
      this.editNotePosition = position
      this.enteredNote = this.notesList[position].text
      this.$refs.enteredNote.focus()
    },

    removeSelectedNote(position) {
      this.notesList.splice(position, 1)
    },

    getHomeFullAddress() {
      if (this.clientFavorites) {
        const searchedProperty = this.clientFavorites.find(
          property => property._id === this.selectedHome.propertyId
        )
        if (searchedProperty) {
          return propertyFullAddress(searchedProperty)
        }
      }
      return ''
    }
  }
}
</script>
<style>
.v-dialog {
  overflow-y: visible!important;
}
</style>
<style lang="sass" scoped>
.feedback-modal 
  overflow-y: visible
.feedback-modal__card
  padding: 1rem
  overflow-y: hidden

.feedback-modal__close
  @extend %modal__button-close, %disable-selection

/** Ribbon top left **/
.feedback-modal__ribbon
  width: 18rem
  height: 18rem
  overflow: hidden
  position: absolute
  &::before,
  &::after
    position: absolute
    z-index: -1
    content: ''
    display: block
  span
    position: absolute
    display: block
    width: 27rem
    padding: 1rem 0
    background-color: $hwayzPinkOrange
    box-shadow: 0 .5rem 1rem rgba(0,0,0,.1)
    color: $hwayzWhite
    text-align: center
    font-size: $hwayzFont1rem4
    font-weight: 400

.feedback-modal__top-left-marker
  top: 0
  left: 0
  &::before, &::after
    border-top-color: transparent
    border-left-color: transparent
  &::before
    top: 0
    right: 0
  &::after
    bottom: 0
    left: 0
  span
    right: -2rem
    top: 5rem
    transform: rotate(-45deg)

.feedback-modal__title
  margin-top: 1rem
  margin-bottom: 2rem
  font-weight: 600
  font-size: $hwayzFont1rem4

.feedback-modal__percent
  width: 8rem

.feedback-modal__progress
  display: flex
  flex-flow: column
  justify-content: flex-start
  align-items: center

.feedback-modal__chips-container
  background-color: #f5f5f5
  padding: 0.5rem
  border-radius: 2rem
  margin-top: 1rem
  text-align: center
  h4
    margin-bottom: 1.5rem
    font-size: $hwayzFont1rem4

.feedback-modal__chips
  font-size: $hwayzFont1rem1
  height: 2.4rem
  color: #fff !important

.feedback-modal__notes
  &--container
    margin-top: 2rem
    background-color: #f5f5f5
    border-radius: 2rem
    padding: 1rem 2rem 2rem
    font-size: $hwayzFont1rem4
  &--inner
    overflow-y: auto
    max-height: 16rem
  &--title
    text-align: left
    margin-bottom: 1.5rem
  &--single-note
    margin-bottom: .2rem
    padding: .5rem 1rem
    padding-right: 6rem
    background-color: $hwayzWhite
    text-align: left
    position: relative
    .note--text
      margin-right: 5rem
    div
      position: absolute
      top: 0.2rem
      right: 1rem
      i
        margin-left: .5rem
        cursor: pointer
        color: $hwayzMediumGray

.feedback-modal__input
  width: 100%
  margin-top: 2rem
  text-align: center
  input
    width: 100%
    border: 0.1rem solid $hwayzMediumGray
    border-radius: 1rem
    outline: none
    padding: 1rem
  button
    color: $hwayzTeal
    border: 1px solid $hwayzTeal
    width: 100%
    margin-top: 1rem
    margin-bottom: 2rem

.feedback-modal__button
  border-radius: 1rem
  background: transparent
  outline: none
  padding: 0.5rem

.feedback-modal__image-container
  margin-top: 5rem
  button
    border: 0.1rem solid #000
    padding-left: 2rem
    padding-right: 2rem
    margin-bottom: 2rem

.feedback-modal__review-container
  display: flex
  flex-direction: column

.feedback-modal__image
  padding: 0 5rem
  overflow: auto
  &-placeholder
    height: 12rem
    max-width: 20rem
    border: .1rem solid $hwayzce
    display: flex
    flex-flow: column
    align-items: center
    justify-content: center
    margin: 2rem auto
    border-radius: 2rem
    position: relative

    img
      width: 100%
      height: 100%
      overflow: hidden
      border-radius: 2rem

    .image-hover
      pointer-events: none
      position: absolute
      bottom: 0
      top: 0
      left: 0
      right: 0
      margin: 0 !important
      background-color: grey
      opacity: 0.9
      color: $hwayzWhite
      border-radius: 2rem

      .hover-icon
        pointer-events: all
        font-size: $hwayzFont1rem6
        position: absolute
        bottom: 1.6rem
        right: 1.6rem
        cursor: pointer

/* Scrollbar style */
.notes-scroll::-webkit-scrollbar-track
  background-color: $hwayzce
  border: solid 1px white

.notes-scroll::-webkit-scrollbar
  width: 4px
  background-color: $hwayzce

.notes-scroll::-webkit-scrollbar-thumb
  background-color: $hwayzShadow

/* Media Queries */
@media only screen and (min-width: 600px)
  .feedback-modal__title
    font-size: 1.4rem

  .feedback-modal__progress
    flex-flow: row
    justify-content: center

  .feedback-modal__input input
    height: 5rem
    padding-left: 2rem
    padding-right: 2rem

  .feedback-modal__input button
    margin: 0
    height: 5rem

@media only screen and (min-width: 960px)
  .feedback-modal__card
    padding: 2rem 3rem

  .feedback-modal__image-container
    margin-top: 0

  .feedback-modal__chips-container
    padding: 1rem 2rem
    text-align: left

  .feedback-modal__notes--container
    padding: 2rem
    flex: 1

  .feedback-modal__image
    padding: 0
    overflow: auto
</style>
