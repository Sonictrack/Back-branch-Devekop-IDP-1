import Vue from "vue";
import mixinMessages from "~/mixins/mixinMessages";
import { TOAST_MESSAGE_VARIANT } from "~/components/enums/messageToast";
import { downloadFile } from "~/api/document";
export default Vue.mixin({
  mixins: [mixinMessages],
  methods: {
    formatNames(files) {
      if (files.length === 1) {
        return files[0].name;
      } else {
        return `${files.length} fichiers selectionnés`;
      }
    },
    hideRealFilename(filename) {
      return filename.split("-uuid-")[1];
    },
    updateDocuments(event, filesToUpload) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        filesToUpload.push(file);
      }
    },
    deleteFile(filesToUploadTemp, filesToUpload, index) {
      filesToUploadTemp.splice(index, 1);
      filesToUpload.splice(index, 1);
    },
    async getDocument(filepath, filename, makeToast){
      try {
        const result = await downloadFile(this.$store.state.authentication.type, filepath);
        if(result.status != 200){
          const json = await result.json()
          if(json.error)
            throw new Error(json.error)
        }

        result.blob().then(blob => {
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.href = url;
          link.download = filename;
          link.click();
        })

      } catch (e) {
        return makeToast('Anomalie', e.message, TOAST_MESSAGE_VARIANT.DANGER);
      }
    },
  },
});
