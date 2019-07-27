#include "tilePaletteWidget.hpp"
#include "../../editor.hpp"

#include <fstream>
#include "nlohmann/json.hpp"
using json = nlohmann::json;

TilePaletteWidget::TilePaletteWidget(Editor * editor, const std::string& map_src) 
    : editorRef(editor)
    , map_src(map_src)
    , Widget("Tile Palette", Anchor::BOTTOM_LEFT) 
{
    // TODO: Make this more elegant somehow?
    std::ifstream file(map_src);
    if (file.is_open()) {
        json data;
        file >> data;

        json tilesheet = data["tilesheet"];
        m_tilesheet_src = std::string("../") + static_cast<std::string>(tilesheet["source"]);
        m_tile_size = tilesheet["tile_size"];
        m_tilesheet_width = tilesheet["width"];
        m_tilesheet_height = tilesheet["height"];
    } else {
        // TODO: Error logging
    }    
}

void TilePaletteWidget::define() {
    for (int y = 0; y < m_tilesheet_height; ++y) {
        for (int x = 0; x < m_tilesheet_width; ++x) {
            // TODO: No magic numbers
            draw_image(
                m_tilesheet_src, 
                64, 
                64, 
                {x * m_tile_size, y * m_tile_size, m_tile_size, m_tile_size},
                [=]() {
                    editorRef->set_brush_tile(y * m_tilesheet_width + x);
                }
            );
        }
    }
}