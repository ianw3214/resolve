#pragma once

#include <vector>

class Widget;
class WidgetManager {
    
public:
    static const int padding = 10;

    void init();
    Widget * addWidget(Widget * widget);

    bool is_mouse_over(int mouse_x, int mouse_y) const;
    bool click(int mouse_x, int mouse_y);
    void render();

private:
    std::vector<Widget*> widgets;

    // Keeps track of where the 4 anchors are to add widgets at the correct position
    int top_left_anchor_x;
    int top_left_anchor_y;
    int top_right_anchor_x;
    int top_right_anchor_y;
    int bottom_left_anchor_x;
    int bottom_left_anchor_y;
    int bottom_right_anchor_x;
    int bottom_right_anchor_y;
};