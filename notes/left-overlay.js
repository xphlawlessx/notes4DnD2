export default {
    data: function () {
        return {
            mapName: '',
            dungeonName: '',
        }
    },
    template:
            `
        <span>
            
        <div class="dropdown">
            <button class="dropbtn">Select Map</button>
            <div id="mapListParent" class="dropdown-content">

            </div>
        </div>
        <br>
        <br>
        <ul id="iconList" style="list-style-type:none">
        </ul>
        <br>
        <input placeholder="Name map"
               class="overlay-content"
               style="height: 28px;width: 100px"
               id="mapNameInput"
               type="text"
               v-model="mapName">
        <input placeholder="Name dungeon"
               class="overlay-content"
               style="height: 28px;width: 100px"
               id="dungeonNameInput"
               type="text"
               v-model="dungeonName">
        <br>
        </span>
    `,
}
