export default class BookmarkPresenter {
  #view;
  #dbModel;

  constructor({ view, model, dbModel }) {
    this.#view = view;
    this.#dbModel = dbModel;
  }

  async showReportsListMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error('showReportsListMap: error:', error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async initialGalleryAndMap() {
    console.log('[DEBUG] initialGalleryAndMap called');
    this.#view.showReportsListLoading();

    try {
      await this.showReportsListMap();

      // Ambil data bookmark dari database lokal
      const bookmarkedReports = await this.#dbModel.getAllReports();
      console.log('[DEBUG] bookmarkedReports:', bookmarkedReports);

      const message = 'Berhasil memuat cerita tersimpan.';
      this.#view.populateBookmarkedReports(message, bookmarkedReports);
      return {
        message,
        listStory: bookmarkedReports,
      };
    } catch (error) {
      console.error('initialGalleryAndMap: error:', error);
      this.#view.populateBookmarkedReportsError('Gagal memuat cerita. Silakan coba lagi nanti.');
    } finally {
      this.#view.hideReportsListLoading();
    }
  }

async removeReport(report, wrapper) {
  try {
    // Menghapus laporan dari database
    await this.#dbModel.removeReport(report.id);
    console.log('Laporan berhasil dihapus dari bookmark');
    
    // Menghapus card dari DOM
    if (wrapper) {
      wrapper.remove();  // Pastikan wrapper yang sesuai dihapus
    }

    // Memperbarui UI
    const updatedReports = await this.#dbModel.getAllReports();
    const message = 'Laporan berhasil dihapus dari bookmark';
    this.#view.populateBookmarkedReports(message, updatedReports);

  } catch (error) {
    console.error('removeReport: error:', error);
    // Menampilkan pesan error ke view
    this.#view.populateBookmarkedReportsError('Gagal menghapus laporan. Silakan coba lagi nanti.');
  }
}

}
