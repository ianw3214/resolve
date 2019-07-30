#pragma once
#include "widget.hpp"

#include <string>

class Editor;
class TilePaletteWidget : public Widget {

    // TODO: This can probably be part of the actual widget system, scalable width/height
    static const int max_width = 200;

public:
    // TODO: Don't need separate map_src, can probably get straight from editor
    TilePaletteWidget(Editor * editor, const std::string & map_src);
    virtual void define() override;
private:
    Editor * m_editor_ref;

    std::string m_map_src;
    std::string m_tilesheet_src;
    int m_tile_size;
    int m_tilesheet_width;
    int m_tilesheet_height;
};