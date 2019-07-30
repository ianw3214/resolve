#include "tilePaletteWidget.hpp"
#include "../../editor.hpp"

#include <fstream>
#include "nlohmann/json.hpp"
using json = nlohmann::json;

TilePaletteWidget::TilePaletteWidget(Editor * editor, const std::string& map_src) 
    : m_editor_ref(editor)
    , m_map_src(map_src)
    , Widget("Tile Palette", Anchor::BOTTOM_LEFT) 
{
    // TODO: Make this more elegant somehow?
    std::ifstream file(m_map_src);
    if (file.is_open()) {
        json data;
        file >> data;

        json tilesheet = data["tilesheet"];
        // TODO: Don't hard code this "../"
        m_tilesheet_src = std::string("../") + static_cast<std::string>(tilesheet["source"]);
        m_tile_size = tilesheet["tile_size"];
        m_tilesheet_width = tilesheet["width"];
        m_tilesheet_height = tilesheet["height"];
    } else {
        // TODO: Error logging
    }    
}

void TilePaletteWidget::define() {
    int curr_x = 0;
    for (int y = 0; y < m_tilesheet_height; ++y) {
        for (int x = 0; x < m_tilesheet_width; ++x) {
            // TODO: No magic numbers
            draw_image(
                m_tilesheet_src, 
                64, 
                64, 
                {x * m_tile_size, y * m_tile_size, m_tile_size, m_tile_size},
                [=]() {
                    m_editor_ref->set_brush_tile(y * m_tilesheet_width + x);
                }
            );
            curr_x += 64;
            // TODO: Fix this - don't use new line (or make new line also work with images)
            if (curr_x >= max_width) {
                curr_x = 0;
                new_line(TextSize::LARGE);
            }
        }
    }
}